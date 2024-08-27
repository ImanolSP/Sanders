# Esquema de la Base de Datos - Fundación Sanders

## Colección: donadores

- **donador_id** (String, Primary Key): Identificador único del usuario.
- **nombre** (String): Nombre del usuario.
- **apellido** (String): Apellido del usuario.
- **email** (String): Correo electrónico del usuario.

## Colección: donaciones

- **donacion_id** (String, Primary Key): Identificador único de la donación.
- **donador_id** (String, Foreign Key): Identificador del usuario que realizó la donación.
- **cantidad_donacion** (Number): Cantidad donada.
- **fecha_donacion** (Date): Fecha de la donación.

## Colección: usuarios

- **usuario_id** (String, Primary Key): Identificador único del usuario.
- **usuario** (String): Nombre de usuario para el acceso al sistema.
- **contraseña** (String): Contraseña del usuario.
- **nivel_acceso** (Integer): Nivel de acceso del usuario.
