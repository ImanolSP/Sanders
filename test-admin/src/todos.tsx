import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, BooleanField,BooleanInput,Create,SimpleForm, required,ImageField} from "react-admin"

export const TodosList=()=>(
    <List>
        <Datagrid>

        <TextField source="id"/>
        <ReferenceField source="userId" reference ="users"/>
        <TextField source="title"/>
        <BooleanField source="completed"/>
    <EditButton/>

        </Datagrid>






    </List>
)

export const TodoEdit=()=>(
    <Edit>
    <SimpleForm>

        <TextInput source = "id " InputProps={{disabled:true}}></TextInput>
        <ReferenceInput source = "userId" reference="users"></ReferenceInput>
        <TextInput source="title"></TextInput>
        <BooleanInput source ="completed"></BooleanInput>
    </SimpleForm>




</Edit>
)

export const TodoCreate=()=>(
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users"></ReferenceInput>
            <TextInput source ="title"></TextInput>
            <BooleanInput source ="completed"></BooleanInput>
        </SimpleForm>
    </Create>
)