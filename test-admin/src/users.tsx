import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, required} from "react-admin"
import {useMediaQuery, Theme} from "@mui/material"

export const UserList=()=>{
    const isSmall= useMediaQuery<Theme>((theme)=> theme.breakpoints.down("sm"));
    return(
    <List>
        {isSmall ?(
            <SimpleList 
            primaryText={(record)=> record.name}
            secondaryText={(record)=> record.phone}
            tertiaryText={(record)=> record.email}
            />
            
        ):(
        <Datagrid>
            <TextField source = "id"/>
            <TextField source="phone"/>
            <EmailField source = "email"/>
            <TextField source = "name"/>
            <TextField source = "company.catchPhrase"/>
            <TextField source = "address.suite"/>
            <EditButton/>
        </Datagrid>

        )}
    </List>
);
};

export const UserEdit = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" InputProps={{disabled:true}}></TextInput>
            <TextInput source="name"></TextInput>
            <TextInput source="username"></TextInput>
            <TextInput source="email"></TextInput>
            <TextInput source="address.street"></TextInput>
            <TextInput source="phone"></TextInput>
            <TextInput source="website"></TextInput>
            <TextInput source="company.name"></TextInput>
            
        </SimpleForm>
    </Edit>
)
export const UserCreate = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="id" validate={[required()]}></TextInput>
            <TextInput source="name"></TextInput>
            <TextInput source="username"></TextInput>
            <TextInput source="email"></TextInput>
            <TextInput source="address.street"></TextInput>
            <TextInput source="phone"></TextInput>
            <TextInput source="website"></TextInput>
            <TextInput source="company.name"></TextInput>
        </SimpleForm>
    </Create>
)