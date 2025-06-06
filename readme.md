# ✨ Prueba Técnica Epale - Plataforma de Contenido Multimedia

Este proyecto representa una arquitectura basada en microservicios para una plataforma de gestión de contenido de video, comentarios y notificación en tiempo real.

---

## 🚀 Arquitectura General

```txt
+---------------------+
| api-gateway-auth    |  <-- Entry point GraphQL
| JWT, Uploads, Proxy |
+---------+-----------+
          |
          v
+------------------+        +----------------+          +---------------------+
| ms-content       | <----> | PostgreSQL     |   --->   | /tmp/videos/*.mp4   |
| REST y DB acceso |        +----------------+          | /tmp/thumbnails/*.jpg |
+------------------+            ^                        +---------------------+
          |                     |
          |                     |
          v                     |
+----------------------+        |
| ms-thumbnail-worker  | <------+ (RabbitMQ)
| ffmpeg screenshot    |        |
+----------------------+        |
          |                      
          v
+--------------------------+
| api-gateway-auth         |
| WebSocket Notification   |
+--------------------------+
```

---

## 🤖 Microservicios y componentes

### 1. **api-gateway-auth**

* Expuesto en `http://localhost:3000/graphql`
* Se encarga de:

    * Login y emisión de JWT
    * Validación de autorización para queries/mutations
    * Proxy a servicios REST (`ms-content`)
    * Publicación WebSocket de notificaciones

### 2. **ms-content**

* REST API (puerto 3001)
* Subida de videos (`/upload`), guardado de metadatos, comentarios, moderación.
* Almacena los videos en `/tmp/videos` y thumbnails en `/tmp/thumbnails`
* Publica eventos a RabbitMQ:

    * `video.convert` (al subir video)
    * `notifications.new` (al recibir nuevo comentario moderado)

### 3. **ms-thumbnail-worker**

* Microservicio sin API HTTP
* Escucha eventos de `video.convert` en RabbitMQ
* Usa `ffmpeg` para generar un screenshot del video
* Actualiza el `thumbnailUrl` de un contenido usando `PUT /content/:id/thumbnail`

### 4. **RabbitMQ**

* Broker de mensajes
* Se usa para comunicar `ms-content` → `ms-thumbnail-worker`

### 5. **PostgreSQL**

* Base de datos central
* Estructura de tablas:

    * `users`
    * `content`
    * `comments`

---

## 🌍 Variables de Entorno

Cada microservicio carga variables desde `.env`. Ejemplo (`api-gateway-auth/.env`):

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=omontilla
DB_PASS=Sofia28.
DB_NAME=streamdb
RABBITMQ_URL=amqp://rabbitmq:5672
```

---

## 🚫 Seguridad

* Los endpoints de GraphQL están protegidos con `@UseGuards(GqlAuthGuard)` y token JWT.
* Los tokens se emiten desde `login` mutation.
* Acciones como `addComment`, `moderateComment`, `uploadVideo` requieren autenticación.

---

## 📊 Tests Unitarios

* Se han implementado con Jest:

    * `AuthService`
    * `CommentService`
    * `ContentService`
* Uso de mocks para `axios`, `typeorm`, `ClientProxy`

---

## 🌐 Acceso a Archivos Multimedia

* Los videos se almacenan en `/tmp/videos/:id.mp4`
* Los thumbnails en `/tmp/thumbnails/:id.jpg`
* Se pueden acceder directamente desde Docker Desktop (bind mount `./shared:/tmp/videos`)

---

## ⛓ WebSocket (Notificaciones)

* El gateway `api-gateway-auth` expone WebSocket para notificaciones:

    * Canal: `notification`
    * Evento: `notifications.new`
* Las notificaciones se envían al recibir un comentario nuevo moderado.
* Url del webSocket http://localhost:3000
* Se puede testear con: [https://piehost.com/socketio-tester](https://piehost.com/socketio-tester)

---

## 🚽 Build & Deploy (Docker Compose)

```bash
docker compose up --build
```

Servicios:

* `api-gateway-auth`: [http://localhost:3000/graphql](http://localhost:3000/graphql)
* `ms-content`: [http://localhost:3001](http://localhost:3001)
* `RabbitMQ`: [http://localhost:15672](http://localhost:15672)
* `webSocket`  http://localhost:3000

---
