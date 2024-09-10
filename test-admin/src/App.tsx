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
import { UserCreate, UserEdit, UserList } from "./users";
import { PostCreate, DonadoresList } from "./Donaciones";
import { authProvider } from "./authProvider";
import { Dashboard } from "./Dashboard";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import PhotoIcon from "@mui/icons-material/Photo";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AlbumIcon from "@mui/icons-material/Album";
import { CommentCreate, CommentEdit, CommentList } from "./comments";
import { AlbumCreate, AlbumEdit, AlbumList } from "./albums";
import { PhotosCreate, PhotosEdit, PhotosList } from "./photos";
import { TodoCreate, TodoEdit, TodosList } from "./todos";
import { MyLoginPage } from "./LogIn";
import { basedatos } from './dataprovider';

export const App = () => (
  <Admin
    loginPage={MyLoginPage}
    authProvider={authProvider}
    layout={Layout}
    dashboard={Dashboard}
    dataProvider={basedatos}
    theme={houseLightTheme}
    darkTheme={houseDarkTheme}
  >
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon} />
    <Resource name="donaciones" list={DonadoresList} create={PostCreate} icon={PostIcon} />
    <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} icon={CommentIcon} />
    <Resource name="albums" list={AlbumList} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon} />
    <Resource name="photos" list={PhotosList} edit={PhotosEdit} create={PhotosCreate} icon={PhotoIcon} />
    <Resource name="todos" list={TodosList} edit={TodoEdit} create={TodoCreate} icon={ChecklistIcon} />
  </Admin>
);