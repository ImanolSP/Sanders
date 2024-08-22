import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, required,ImageField} from "react-admin"

export const PhotosList=()=>(

<List>
    <Datagrid>
        <TextField source="id"/>
        <ReferenceField source="albumId" reference ="albums"/>
        <TextField source="title"/>
        <ImageField source="url"></ImageField>
        <ImageField source ="thumbnailUrl"></ImageField>
<EditButton/>

    </Datagrid>


</List>
)

export const PhotosEdit=()=>(
    <Edit>
    <SimpleForm>

        <TextInput source = "id " InputProps={{disabled:true}}></TextInput>
        <ReferenceInput source = "albumId" reference="albums"></ReferenceInput>
        <TextInput source="title"></TextInput>
        <TextInput source="url"></TextInput>
        <TextInput source ="thumbnailUrl"></TextInput>
    </SimpleForm>

</Edit>
)

export const PhotosCreate=()=>(
    <Create>
        <SimpleForm>
            <ReferenceInput source="albumId" reference="albums"></ReferenceInput>
            <TextInput source ="title"></TextInput>
            <TextInput source ="url"></TextInput>
            <TextInput source ="thumbnailUrl"></TextInput>
        </SimpleForm>
    </Create>
)

