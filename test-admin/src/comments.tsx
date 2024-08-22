import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, required} from "react-admin"


export const CommentList=()=>(
    <List>
    <Datagrid>
        <TextField source="id"/>
        <ReferenceField source="postId" reference ="posts"/>
        <TextField source="name"/>
        <TextField source="email"/>
        <TextField source="body"/>
<EditButton/>

    </Datagrid>


</List>

)

export const CommentEdit=()=>(
    <Edit>
    <SimpleForm>

        <TextInput source = "id " InputProps={{disabled:true}}></TextInput>
        <ReferenceInput source = "postId" reference="posts">
        </ReferenceInput>
        <TextInput source="name"></TextInput>
        <TextInput source="email"></TextInput>
        <TextInput source ="body"></TextInput>
    </SimpleForm>




</Edit>
)

export const CommentCreate=()=>(
    <Create>
        <SimpleForm>
            <ReferenceInput source="postId" reference="posts"></ReferenceInput>
            <TextInput source ="name"></TextInput>
            <TextInput source ="email"></TextInput>
            <TextInput source = "body" multiline rows={5}></TextInput>
        </SimpleForm>
    </Create>
)