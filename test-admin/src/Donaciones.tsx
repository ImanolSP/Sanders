import {List,Datagrid,DateInput,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, NumberInput,required} from "react-admin"
export const DonadoresList = () => (

<List>
    <Datagrid>
        <TextField source="monto"/>
        <TextField source="fecha"/>
        <TextField source= "donador.nombre"/>
        <TextField source= "donador.apellido"/>
<EditButton/>

    </Datagrid>


</List>

);

/*export const PostEdit = () => (
<Edit>
    <SimpleForm>

        <TextInput source = "donador.nombre "></TextInput>
        
        <TextInput source="monto"></TextInput>
    </SimpleForm>




</Edit>





)*/

export const PostCreate = ()=>(
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