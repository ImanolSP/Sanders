import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Grid, Button, ButtonGroup } from "@mui/material";
import { useDataProvider, usePermissions, RaRecord } from 'react-admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { v4 as uuidv4 } from 'uuid';

interface Donation extends RaRecord {
  id: string;
  monto: number;
  fecha: string;
  donador: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export const Dashboard = () => {
  const dataProvider = useDataProvider();
  const { permissions } = usePermissions();
  const [donationData, setDonationData] = useState<Donation[]>([]);
  const [viewBy, setViewBy] = useState<'donor' | 'date'>('date');

  useEffect(() => {
    dataProvider.getList<Donation>('donaciones', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'fecha', order: 'ASC' }
    })
    .then(response => {
      const dataWithId = response.data.map(donation => ({
        ...donation,
        id: uuidv4(),
      }));
      setDonationData(dataWithId);
    })
    .catch(error => {
      console.error('Error fetching donation data:', error);
    });
  }, [dataProvider]);

  let totalDonationMoney = 0;
  const uniqueDonations = donationData.length;
  donationData.forEach(donation => totalDonationMoney += donation.monto);
  const averageDonation = totalDonationMoney / uniqueDonations;

  const pieChartData = donationData.reduce((acc, donation) => {
    const key = viewBy === 'donor' && permissions === 'admin'
      ? donation.donador.nombre
      : viewBy === 'date'
      ? donation.fecha
      : 'Hidden';

    const existingEntry = acc.find(entry => entry.name === key);

    if (existingEntry) {
      existingEntry.value += donation.monto;
    } else {
      acc.push({ name: key, value: donation.monto });
    }

    return acc;
  }, [] as { name: string; value: number }[]);

  const barChartData = Array.from({ length: 12 }, (_, index) => {
    const month = new Date();
    month.setMonth(month.getMonth() - index);
    const monthString = month.toLocaleString('default', { month: 'long' });
    const year = month.getFullYear();
    const monthKey = `${monthString} ${year}`;

    const totalForMonth = donationData
      .filter(donation => {
        const donationDate = new Date(donation.fecha);
        return donationDate.getFullYear() === year && donationDate.getMonth() === month.getMonth();
      })
      .reduce((sum, donation) => sum + donation.monto, 0);

    return {
      name: monthKey,
      monto: totalForMonth,
    };
  }).reverse(); // To show from September 2023 to September 2024

  // Process top 10 donors based on total donated and average donation
  const donorsSummary = donationData.reduce((acc, donation) => {
    const donorKey = `${donation.donador.nombre} ${donation.donador.apellido} (${donation.donador.email})`;
    if (!acc[donorKey]) {
      acc[donorKey] = { totalDonated: 0, donationsCount: 0 };
    }
    acc[donorKey].totalDonated += donation.monto;
    acc[donorKey].donationsCount += 1;
    return acc;
  }, {} as { [key: string]: { totalDonated: number; donationsCount: number } });

  const topDonorsByTotal = Object.entries(donorsSummary)
    .sort((a, b) => b[1].totalDonated - a[1].totalDonated)
    .slice(0, 10)
    .map(([donor, { totalDonated }]) => ({ donor, totalDonated }));

  const topDonorsByAverage = Object.entries(donorsSummary)
    .map(([donor, { totalDonated, donationsCount }]) => ({
      donor,
      averageDonated: totalDonated / donationsCount,
    }))
    .sort((a, b) => b.averageDonated - a.averageDonated)
    .slice(0, 10);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Obtener las donaciones del mes actual por día
  const lineChartData = Array.from({ length: new Date().getDate() }, (_, index) => {
    const day = new Date();
    day.setDate(index + 1);
    const dayString = day.toLocaleDateString('default', { day: 'numeric', month: 'short' });

    const totalForDay = donationData
      .filter(donation => {
        const donationDate = new Date(donation.fecha);
        return donationDate.getFullYear() === day.getFullYear() && donationDate.getMonth() === day.getMonth() && donationDate.getDate()+1 === day.getDate();
      })
      .reduce((sum, donation) => sum + donation.monto, 0);

    return {
      name: dayString,
      monto: totalForDay,
    };
  });

  return (
    <Grid container spacing={3}>
      {/* Welcome Card */}
      <Grid item xs={10}>
        <Card>
          <CardHeader title="Welcome to the Admin Dashboard" />
          <CardContent>
            <p>Manage and monitor donations efficiently.</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Toggle for View By */}
      {permissions === 'admin' && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <ButtonGroup variant="contained">
                <Button onClick={() => setViewBy('date')}>View by Date</Button>
                <Button onClick={() => setViewBy('donor')}>View by Donor</Button>
              </ButtonGroup>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Pie Chart and Donation Stats */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Donations Distribution" />
          <CardContent>
            <ResponsiveContainer width="100%" height={357}>
              <PieChart>
                <Pie dataKey="value" data={pieChartData} cx="50%" cy="50%" outerRadius={120} fill="#82ca9d" label>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0072B2', '#E69F00', '#009E73', '#D55E00', '#CC79A7', '#F0E442', '#56B4E9'][index % 7]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top 10 Donors by Total and Average Donation - Only in donor view */}
      {viewBy === 'donor' && (
        <>
          {/* Top 10 Donors by Total Donation */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Top 10 Donors by Total Donation" />
              <CardContent>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {topDonorsByTotal.map((donor, index) => (
                    <li key={index} style={{ fontSize: '16px', marginBottom: '10px' }}>
                      {donor.donor}: <strong>${donor.totalDonated}</strong>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 10 Donors by Average Donation */}
          <Grid item xs={12} md={6}>
            <Card >
              <CardHeader title="Top 10 Donors by Average Donation" />
              <CardContent>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {topDonorsByAverage.map((donor, index) => (
                    <li key={index} style={{ fontSize: '16px', marginBottom: '10px' }}>
                      {donor.donor}: <strong>${donor.averageDonated.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Donation Statistics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="Donation Stats"
            style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '0' }}
          />
          <CardContent>
            <h2 style={{ textAlign: 'center', fontSize: '1.1rem', margin: '10px 0' }}>Number of Donations</h2>
            <h3 style={{ textAlign: 'center', fontSize: '2rem', color: '#2F3EB1', fontWeight: 'bold' }}>{uniqueDonations}</h3>
            <h2 style={{ textAlign: 'center', fontSize: '1.1rem', margin: '10px 0' }}>Total Donation Amount</h2>
            <h3 style={{ textAlign: 'center', fontSize: '2rem', color: '#2F3EB1', fontWeight: 'bold' }}>${totalDonationMoney}</h3>
            <h2 style={{ textAlign: 'center', fontSize: '1.1rem', margin: '10px 0' }}>Average Donation Amount</h2>
            <h3 style={{ textAlign: 'center', fontSize: '2rem', color: '#2F3EB1', fontWeight: 'bold' }}>${averageDonation.toFixed(2)}</h3>
          </CardContent>
        </Card>
      </Grid>

      {/* Graphs - Only in date view */}
      {viewBy === 'date' && (
        <>
          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Donations of the month" />
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="monto" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Monthly Donations Amount" />
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 20, bottom: 20}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-20} // Rota el texto -30 grados
                      textAnchor="end" // Alinea el texto al final
                      interval={0} // Muestra todas las etiquetas
                      tickFormatter={(value) => {
                        const [month, year] = value.split(" "); 
                        const lastTwoDigits = year.slice(-2); 
                        return `${month} ${lastTwoDigits}`; 
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="monto" 
                      fill="#82ca9d" 
                      />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};
