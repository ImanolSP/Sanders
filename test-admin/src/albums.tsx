import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, required} from "react-admin"

export const AlbumList=()=>(
    <List>
    <Datagrid>
        <TextField source="id"/>
        <ReferenceField source="userId" reference ="users"/>
        <TextField source="title"/>
<EditButton/>

    </Datagrid>


</List>
)

export const AlbumEdit=()=>(
    <Edit>
    <SimpleForm>

        <TextInput source = "id " InputProps={{disabled:true}}></TextInput>
        <ReferenceInput source = "userId" reference="users"></ReferenceInput>
        <TextInput source="title"></TextInput>
    </SimpleForm>




</Edit>

)

export const AlbumCreate=()=>(
<Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users"></ReferenceInput>
            <TextInput source ="title"></TextInput>
        </SimpleForm>
    </Create>

)