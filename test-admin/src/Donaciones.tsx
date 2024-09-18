import {List,Datagrid,DateInput,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, NumberInput,required,DeleteButton,NumberInputProps,TextInputProps} from "react-admin"
import { useWatch } from "react-hook-form";
export const DonadoresList = () => (

<List>
    <Datagrid>
        <TextField source="monto"/>
        <TextField source="fecha"/>
        <TextField source="metodo"/>
        <TextField source= "donador.nombre"/>
        <TextField source= "donador.apellido"/>
<EditButton/>
<DeleteButton/>
    </Datagrid>


</List>

);
const EditableDonationField1 = (props: NumberInputProps) => {
    const metodoValue = useWatch({ name: 'metodo' });  // Watch the "metodo" field value

    return (
        <NumberInput
            {...props}
            disabled={metodoValue !== 'manual'}  // Disable if "metodo" is not "manual"
        />
    );
};
const EditableDonationField2 = (props: TextInputProps) => {
    const metodoValue = useWatch({ name: 'metodo' });  // Watch the "metodo" field value

    return (
        <TextInput
            {...props}
            disabled={metodoValue !== 'manual'}  // Disable if "metodo" is not "manual"
        />
    );
};

export const DonadoresEdit = () => (
<Edit>
    <SimpleForm>

        <EditableDonationField2 source = "donador.nombre"/>
        <EditableDonationField2 source = "donador.apellido"/>
        <EditableDonationField2 source = "fecha"/>
        <EditableDonationField1 source = "monto"/>
    </SimpleForm>




</Edit>





)

export const DonadoresCreate = ()=>(
    <Create>
        <SimpleForm>
        <NumberInput source="monto"></NumberInput>
        <DateInput source="fecha"></DateInput>
        <TextInput source="metodo" defaultValue="manual" disabled/>
        <TextInput source = "donador.nombre"></TextInput>
        <TextInput source = "donador.apellido"></TextInput>
        <TextInput source = "donador.email"></TextInput>
        
        </SimpleForm>
    </Create>
)