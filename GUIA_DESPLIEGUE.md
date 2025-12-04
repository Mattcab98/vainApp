# Guía de Despliegue VainApp - Paso a Paso

Esta guía te llevará desde cero hasta tener tu aplicación funcionando en internet, completamente gratis.

## ⏱️ Tiempo Total: 30-40 minutos

---

## 📋 Requisitos Previos

Necesitas crear cuentas gratuitas en estos servicios (si no las tienes):

1. **GitHub** - Para almacenar el código
   - Ve a: https://github.com/signup
   - Crea tu cuenta gratis

2. **MongoDB Atlas** - Para la base de datos
   - Ve a: https://www.mongodb.com/cloud/atlas/register
   - Crea tu cuenta gratis

3. **Render** - Para el backend
   - Ve a: https://dashboard.render.com/register
   - Puedes usar tu cuenta de GitHub para registrarte

4. **Vercel** - Para el frontend
   - Ve a: https://vercel.com/signup
   - Puedes usar tu cuenta de GitHub para registrarte

---

## 🚀 Paso 1: Configurar MongoDB Atlas (10 minutos)

### 1.1 Crear un Cluster

1. Inicia sesión en [MongoDB Atlas](https://cloud.mongodb.com)
2. Haz clic en **"Build a Database"** (Crear una base de datos)
3. Selecciona **"M0 FREE"** (el plan gratuito)
4. Elige una región cercana a ti (por ejemplo, AWS / São Paulo)
5. Dale un nombre al cluster (puedes dejarlo como "Cluster0")
6. Haz clic en **"Create"** (Crear)
7. Espera 3-5 minutos mientras se crea

### 1.2 Crear un Usuario de Base de Datos

1. En la pantalla de seguridad que aparece, crea un usuario:
   - **Username**: `vainapp_user` (o el que prefieras)
   - **Password**: Haz clic en "Autogenerate Secure Password" y **GUARDA ESTA CONTRASEÑA**
   - Haz clic en **"Create User"**

### 1.3 Configurar Acceso de Red

1. Baja hasta "Where would you like to connect from?"
2. Haz clic en **"Add My Current IP Address"**
3. Luego haz clic en **"Add Entry"** y agrega:
   - **IP Address**: `0.0.0.0/0`
   - **Description**: `Allow all`
4. Haz clic en **"Finish and Close"**

### 1.4 Obtener la Cadena de Conexión

1. Haz clic en **"Connect"** en tu cluster
2. Selecciona **"Connect your application"**
3. Copia la cadena de conexión (se ve así):
   ```
   mongodb+srv://vainapp_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **IMPORTANTE**: Reemplaza `<password>` con la contraseña que guardaste
5. Agrega el nombre de la base de datos después de `.net/`:
   ```
   mongodb+srv://vainapp_user:tu_contraseña@cluster0.xxxxx.mongodb.net/vainapp?retryWrites=true&w=majority
   ```
6. **GUARDA ESTA CADENA** - la necesitarás más adelante

---

## 📦 Paso 2: Subir el Código a GitHub (10 minutos)

### 2.1 Crear un Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** arriba a la derecha → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `vainapp`
   - **Description**: `Plataforma de suscripción de café diario`
   - **Visibility**: Public (o Private si prefieres)
   - **NO** marques "Add a README file"
4. Haz clic en **"Create repository"**
5. **GUARDA LA URL** del repositorio (ejemplo: `https://github.com/tu-usuario/vainapp.git`)

### 2.2 Inicializar Git en tu Proyecto

Abre una terminal en la carpeta `vainapp` y ejecuta:

```bash
# Navega a la carpeta del proyecto
cd c:/Users/PC/.gemini/antigravity/playground/electric-gravity/vainapp

# Inicializa git
git init

# Agrega todos los archivos
git add .

# Haz el primer commit
git commit -m "Initial commit - VainApp MVP"

# Conecta con GitHub (reemplaza con TU URL)
git remote add origin https://github.com/TU-USUARIO/vainapp.git

# Sube el código
git branch -M main
git push -u origin main
```

Si te pide credenciales:
- **Username**: tu usuario de GitHub
- **Password**: usa un [Personal Access Token](https://github.com/settings/tokens) (no tu contraseña)

---

## 🖥️ Paso 3: Desplegar el Backend en Render (10 minutos)

### 3.1 Crear el Web Service

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub si aún no lo has hecho
4. Busca y selecciona tu repositorio `vainapp`
5. Haz clic en **"Connect"**

### 3.2 Configurar el Servicio

Llena los campos así:

- **Name**: `vainapp-backend`
- **Region**: Elige la más cercana (por ejemplo, Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3.3 Agregar Variables de Entorno

Baja hasta la sección **"Environment Variables"** y haz clic en **"Add Environment Variable"**.

Agrega estas variables **UNA POR UNA**:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | Tu cadena de MongoDB Atlas (la que guardaste en el Paso 1.4) |
| `JWT_SECRET` | Genera uno con: `openssl rand -base64 32` o usa cualquier texto aleatorio de 32+ caracteres |
| `STRIPE_SECRET_KEY` | `sk_test_placeholder` (por ahora) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_placeholder` (por ahora) |
| `FRONTEND_URL` | `http://localhost:5173` (lo actualizaremos después) |
| `NODE_ENV` | `production` |

### 3.4 Desplegar

1. Haz clic en **"Create Web Service"**
2. Espera 5-10 minutos mientras se despliega
3. Verás logs en tiempo real
4. Cuando veas "Server running on port 5000", ¡está listo!

### 3.5 Verificar el Backend

1. Copia la URL de tu servicio (arriba, algo como `https://vainapp-backend.onrender.com`)
2. **GUARDA ESTA URL**
3. Abre en tu navegador: `https://vainapp-backend.onrender.com/health`
4. Deberías ver: `{"status":"ok","timestamp":"..."}`

✅ **¡Backend desplegado con éxito!**

---

## 🌐 Paso 4: Desplegar el Frontend en Vercel (5 minutos)

### 4.1 Importar el Proyecto

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Busca tu repositorio `vainapp` y haz clic en **"Import"**

### 4.2 Configurar el Proyecto

Configura así:

- **Framework Preset**: Vite (debería detectarlo automáticamente)
- **Root Directory**: Haz clic en **"Edit"** y selecciona `frontend`
- **Build Command**: `npm run build` (ya está por defecto)
- **Output Directory**: `dist` (ya está por defecto)

### 4.3 Agregar Variable de Entorno

1. Despliega la sección **"Environment Variables"**
2. Agrega:
   - **Name**: `VITE_API_URL`
   - **Value**: La URL de tu backend de Render (ejemplo: `https://vainapp-backend.onrender.com`)
3. Asegúrate de que esté marcado para **Production**, **Preview**, y **Development**

### 4.4 Desplegar

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos
3. Verás una animación de confeti cuando termine 🎉

### 4.5 Obtener la URL del Frontend

1. Copia la URL de tu aplicación (ejemplo: `https://vainapp.vercel.app`)
2. **GUARDA ESTA URL**
3. Haz clic en **"Visit"** para ver tu aplicación

✅ **¡Frontend desplegado con éxito!**

---

## 🔄 Paso 5: Actualizar CORS en el Backend (3 minutos)

Ahora que tienes la URL del frontend, necesitas actualizarla en el backend:

1. Vuelve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en tu servicio `vainapp-backend`
3. Ve a la pestaña **"Environment"**
4. Busca la variable `FRONTEND_URL`
5. Haz clic en el ícono de editar (lápiz)
6. Cambia el valor a tu URL de Vercel (ejemplo: `https://vainapp.vercel.app`)
7. Haz clic en **"Save Changes"**
8. El servicio se redesplegar automáticamente (2-3 minutos)

---

## ✅ Paso 6: Verificar que Todo Funcione (5 minutos)

### 6.1 Probar el Backend

1. Abre: `https://TU-BACKEND.onrender.com/health`
2. Deberías ver: `{"status":"ok","timestamp":"..."}`

### 6.2 Probar el Frontend

1. Abre tu URL de Vercel: `https://TU-APP.vercel.app`
2. Deberías ver la página de inicio con gradientes bonitos

### 6.3 Probar el Flujo Completo

1. **Crear una cuenta**:
   - Haz clic en "Get Started"
   - Llena el formulario de registro
   - Haz clic en "Sign Up"

2. **Verificar en MongoDB**:
   - Ve a MongoDB Atlas
   - Haz clic en "Browse Collections"
   - Deberías ver tu usuario en la colección `users`

3. **Generar QR**:
   - En el dashboard, haz clic en "Generate QR Code"
   - Deberías ver un código QR

4. **Verificar en la consola del navegador**:
   - Presiona F12 para abrir DevTools
   - Ve a la pestaña "Console"
   - No debería haber errores rojos

---

## 🎉 ¡Felicidades! Tu Aplicación Está en Línea

### Tus URLs:

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.onrender.com`
- **Base de Datos**: MongoDB Atlas

### Comparte tu aplicación:

Ahora puedes compartir la URL del frontend con cualquier persona y podrán:
- Crear una cuenta
- Iniciar sesión
- Generar códigos QR

---

## 🔧 Solución de Problemas Comunes

### Problema: "Cannot connect to backend"

**Solución**:
1. Verifica que `VITE_API_URL` en Vercel sea correcto
2. Verifica que `FRONTEND_URL` en Render sea correcto
3. Abre la consola del navegador (F12) y busca errores CORS
4. Asegúrate de que el backend esté corriendo (visita `/health`)

### Problema: "MongoDB connection failed"

**Solución**:
1. Verifica que la cadena de conexión sea correcta
2. Asegúrate de haber reemplazado `<password>` con tu contraseña real
3. Verifica que hayas agregado `0.0.0.0/0` a la lista de IPs permitidas
4. Revisa los logs en Render para ver el error exacto

### Problema: El backend tarda mucho en responder

**Explicación**: Render en el plan gratuito "duerme" el servicio después de 15 minutos de inactividad. La primera petición después de que se duerme puede tardar 30-60 segundos.

**Solución**: Espera un minuto y vuelve a intentar. Considera actualizar a un plan de pago ($7/mes) si necesitas que esté siempre activo.

### Problema: Error 404 en rutas del frontend

**Solución**: El archivo `vercel.json` ya está configurado para manejar esto. Si aún tienes problemas:
1. Verifica que `vercel.json` esté en la carpeta `frontend`
2. Redespliega desde Vercel Dashboard

---

## 📱 Próximos Pasos

Ahora que tu aplicación está desplegada, puedes:

1. **Configurar un dominio personalizado**:
   - En Vercel: Settings → Domains
   - En Render: Settings → Custom Domains

2. **Integrar Stripe para pagos reales**:
   - Crea una cuenta en Stripe
   - Obtén tus API keys
   - Actualiza las variables de entorno

3. **Agregar monitoreo**:
   - Sentry para errores
   - Google Analytics para estadísticas

4. **Crear un ambiente de staging**:
   - Crea una rama `develop` en GitHub
   - Vercel automáticamente creará previews

---

## 💡 Consejos Importantes

1. **Nunca compartas tus variables de entorno** (especialmente `JWT_SECRET` y claves de Stripe)
2. **Haz backups regulares** de tu base de datos MongoDB
3. **Monitorea los logs** en Render para detectar errores
4. **Actualiza las dependencias** regularmente con `npm update`
5. **Usa git branches** para nuevas features antes de desplegar a producción

---

## 📞 Soporte

Si tienes problemas:

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## 🎯 Resumen de URLs y Credenciales

Guarda esta información en un lugar seguro:

```
FRONTEND URL: https://__________.vercel.app
BACKEND URL: https://__________.onrender.com

MONGODB:
Connection String: mongodb+srv://...
Username: __________
Password: __________

GITHUB:
Repository: https://github.com/__________/vainapp

JWT_SECRET: __________
```

---

**¡Tu VainApp está lista para el mundo!** ☕🚀
