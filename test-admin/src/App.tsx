import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  defaultTheme,
  houseLightTheme, 
  houseDarkTheme,
} from "react-admin";
import { Layout } from "./Layout";
//import { dataProvider } from "./dataProvider";
import { UserCreate, UserEdit, UserList } from "./users";
import {/*PostCreate, PostEdit,*/ PostList} from "./posts";
import { authProv } from "./authProvider";
import { Dashboard } from "./Dashboard";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import PhotoIcon from "@mui/icons-material/Photo";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AlbumIcon from "@mui/icons-material/Album";
import { PageTheme, PageThemeDark } from "./Themes";
import { CommentCreate, CommentEdit, CommentList } from "./comments";
import { AlbumCreate, AlbumEdit, AlbumList } from "./albums";
import { PhotosCreate, PhotosEdit, PhotosList } from "./photos";
import { TodoCreate, TodoEdit, TodosList } from "./todos";
import { MyLoginPage } from "./LogIn";
import { usePermissions } from "react-admin";
import { permission } from "process";
import simpleRestProvider from 'ra-data-simple-rest';
import {basedatos} from './dataprovider'


export const App = () => (


  <Admin  loginPage={MyLoginPage} authProvider={authProv} layout={Layout} dashboard={Dashboard} dataProvider={basedatos} theme={houseLightTheme}
  darkTheme={houseDarkTheme} /*theme={PageTheme} darkTheme={PageThemeDark}*/> /* The themes that are commented are custom themes, I created, the one being used is one improted*/

    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} ></Resource>
    <Resource name="donaciones" list={PostList} /*edit={PostEdit} create={PostCreate}*/ icon={PostIcon}></Resource>

    <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate}icon={CommentIcon}></Resource>

    <Resource name="albums" list={AlbumList} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon}></Resource>

    <Resource name="photos" list={PhotosList} edit={PhotosEdit} create={PhotosCreate} icon={PhotoIcon}></Resource>

    <Resource name="todos" list={TodosList} edit={TodoEdit} create={TodoCreate} icon={ChecklistIcon}></Resource>

  </Admin>
);
