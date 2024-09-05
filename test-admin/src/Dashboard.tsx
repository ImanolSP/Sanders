import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Grid, Button, ButtonGroup } from "@mui/material";
import { useDataProvider, RaRecord } from 'react-admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { v4 as uuidv4 } from 'uuid';

// Define the Donation interface to match your data
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
  const [donationData, setDonationData] = useState<Donation[]>([]);
  const [viewBy, setViewBy] = useState<'donor' | 'date'>('date'); // State for data view (by donor or date)

  useEffect(() => {
    dataProvider.getList<Donation>('donaciones', {
      pagination: { page: 1, perPage: 100 }, 
      sort: { field: 'fecha', order: 'ASC' }
    })
    .then(response => {
      // Generate a unique ID for each donation if not already provided
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

  // Prepare data for PieChart
  const pieChartData = donationData.reduce((acc, donation) => {
    const key = viewBy === 'donor' ? donation.donador.nombre : donation.fecha;
    const existingEntry = acc.find(entry => entry.name === key);

    if (existingEntry) {
      existingEntry.value += donation.monto;
    } else {
      acc.push({ name: key, value: donation.monto });
    }

    return acc;
  }, [] as { name: string; value: number }[]);

  // Prepare data for BarChart
  const barChartData = donationData.map(donation => ({
    name: viewBy === 'donor' ? donation.donador.nombre : donation.fecha,
    monto: donation.monto,
  }));

  return (
    <Grid container spacing={3}>
      {/* Welcome Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Welcome to the Admin Dashboard" />
          <CardContent>
            <p>Manage and monitor donations efficiently.</p>
          </CardContent>
        </Card>
      </Grid>

      {/* Toggle for View By */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <ButtonGroup variant="contained" aria-label="outlined secondary button group">
              <Button onClick={() => setViewBy('date')}>View by Date</Button>
              <Button onClick={() => setViewBy('donor')}>View by Donor</Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </Grid>

      {/* Line Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Donations Over Time" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={viewBy === 'donor' ? 'donador.nombre' : 'fecha'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="monto" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Donations Distribution" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#8dd1e1', '#82ca9d', '#ffc658'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Donations Comparison" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monto" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

