import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm} from "react-admin"
export const PostList = () => (

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

        <TextInput source = "id " InputProps={{disabled:true}}></TextInput>
        <ReferenceInput source = "userId" reference="users">
        <SelectInput optionText="username" />

        </ReferenceInput>
        <TextInput source="title"></TextInput>
        <TextInput source ="Body"></TextInput>
    </SimpleForm>




</Edit>





)

export const PostCreate = ()=>(
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users"></ReferenceInput>
            <TextInput source ="title"></TextInput>
            <TextInput source = "body" multiline rows={5}></TextInput>
        </SimpleForm>
    </Create>
)*/