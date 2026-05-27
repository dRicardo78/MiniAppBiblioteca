# 🔧 CONFIGURACIÓN DE MONGODB ATLAS

## Paso 1: Crear Cuenta en MongoDB Atlas

1. Ve a [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Haz clic en **"Try Free"**
3. Completa el formulario de registro (email, contraseña, nombre, empresa)
4. Acepta los términos y haz clic en **"Create your account"**
5. Verifica tu email

## Paso 2: Crear un Cluster

1. Después de verificar, ingresa a tu cuenta
2. Haz clic en **"Create"** para crear un nuevo proyecto (si es necesario)
3. Nombra el proyecto: `MiniAppBiblioteca`
4. Haz clic en **"Create Project"**
5. En la siguiente pantalla, haz clic en **"Build a Database"**
6. Elige **"Free"** (M0 - Sandbox)
7. Selecciona tu región preferida (ej: `us-east-1` para Estados Unidos)
8. Haz clic en **"Create Deployment"**
9. Espera 1-2 minutos mientras MongoDB crea tu cluster

## Paso 3: Crear Usuario de Base de Datos

1. En la pantalla de conexión, verás **"Create a Database User"**
2. Ingresa:
   - **Username**: `minibib_user`
   - **Password**: crea una contraseña fuerte (guárdala)
   - Click en **"Create User"**

Ejemplo:
```
Username: minibib_user
Password: MySecure!Pass123
```

## Paso 4: Permitir Acceso desde Cualquier IP

1. Haz clic en **"Add My Current IP Address"** O
2. Ve a **"Network Access"** → **"Add IP Address"**
3. Ingresa: `0.0.0.0/0` (permite acceso desde cualquier lugar)
   - ⚠️ NOTA: Solo para desarrollo. En producción, restringe a IPs específicas.
4. Haz clic en **"Add Entry"**

## Paso 5: Obtener String de Conexión

1. Haz clic en **"Connect"**
2. Selecciona **"Drivers"**
3. Elige:
   - **Driver**: Node.js
   - **Version**: 4.1 o posterior
4. Copia la string de conexión que aparece:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

## Paso 6: Actualizar archivo .env

1. Abre `/workspaces/MiniAppBiblioteca/.env`
2. Reemplaza los valores:
   ```env
   # Busca esta línea:
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/minibib?retryWrites=true&w=majority
   
   # Reemplázala con tu string de conexión. Ejemplo:
   MONGODB_URI=mongodb+srv://minibib_user:MySecure!Pass123@cluster0.mongodb.net/minibib?retryWrites=true&w=majority
   ```

3. Asegúrate que:
   - Reemplaces `<username>` con tu usuario (ej: `minibib_user`)
   - Reemplaces `<password>` con tu contraseña
   - La URL incluya `/minibib` (nombre de base de datos)

## Verificar Configuración

Ejecuta en terminal:
```bash
npm start
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
🚀 Servidor iniciado exitosamente
Puerto: 5000
```

Si ves:
```
❌ Error conectando a MongoDB
```

Revisa:
1. La string de conexión en .env
2. El username y password sean correctos
3. El IP esté permitido en Network Access

## 🔐 Seguridad: Guardar tu .env en .gitignore

Asegúrate que `.env` NO se suba a GitHub (contiene contraseña):

```bash
# .gitignore (crea este archivo si no existe)
.env
node_modules/
```

## Comando Rápido para Desarrollo

Para auto-reiniciar el servidor cuando hagas cambios:
```bash
npm run dev
```

Esto usa `nodemon` (ya instalado).

---

✅ **¡Listo!** Ahora puedes conectar tu frontend a la API.
