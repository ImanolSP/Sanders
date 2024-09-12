import {List,Datagrid,TextField,SelectInput,TextInput,ReferenceInput,SimpleList,EmailField,ReferenceField, EditButton, Edit, Create,SimpleForm, required, NumberInput,DELETE, DeleteButton, ListNoResults} from "react-admin"
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
            <TextField source = "usuario"/>
            <TextField source="nivel_acceso"/>
            <EditButton/>
            <DeleteButton />
        </Datagrid>

        )}
    </List>
);
};

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="usuario" InputProps={{disabled:true}} />
            <TextInput source="contraseña" type="password" InputProps={{disabled:true}} />
            <NumberInput source="nivel_acceso" validate={required()} />
        </SimpleForm>
    </Edit>
);

export const UserCreate = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="usuario"></TextInput>
            <TextInput source="contraseña"></TextInput>
            <NumberInput source="nivel_acceso"></NumberInput>
        </SimpleForm>
    </Create>
)

