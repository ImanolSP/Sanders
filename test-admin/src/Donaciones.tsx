import {List,Datagrid,DateInput,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, NumberInput,required,DeleteButton} from "react-admin"
export const DonadoresList = () => (

<List>
    <Datagrid>
        <TextField source="monto"/>
        <TextField source="fecha"/>
        <TextField source= "donador.nombre"/>
        <TextField source= "donador.apellido"/>
<EditButton/>
<DeleteButton/>
    </Datagrid>


</List>

);

export const DonadoresEdit = () => (
<Edit>
    <SimpleForm>

        <TextInput source = "donador.nombre "></TextInput>
        
        <TextInput source="monto"></TextInput>
    </SimpleForm>




</Edit>





)

export const DonadoresCreate = ()=>(
    <Create>
        <SimpleForm>
        <NumberInput source="monto"></NumberInput>
        <DateInput source="fecha"></DateInput>
        <TextInput source = "donador.nombre"></TextInput>
        <TextInput source = "donador.apellido"></TextInput>
        <TextInput source = "donador.email"></TextInput>
        
        </SimpleForm>
    </Create>
)