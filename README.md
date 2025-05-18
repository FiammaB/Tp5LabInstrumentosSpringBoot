# Tp5LabInstrumentosSpringBoot

## Tienda Online de Instrumentos Musicales

Este proyecto es una aplicación web completa de e-commerce para una tienda de instrumentos musicales. Permite a los usuarios explorar el catálogo, agregar productos al carrito y simular compras. Además, cuenta con un panel administrativo para la gestión de productos y usuarios, así como funcionalidades de análisis y exportación de datos.

Desarrollado de forma unipersonal como parte de un proyecto académico, este Full Stack muestra habilidades en frontend y backend, manejo de bases de datos, autenticación y consumo de APIs.

## Características Principales

* **Catálogo de Instrumentos:** Visualización de instrumentos disponibles.
* **Carrito de Compras:** Funcionalidad para añadir, actualizar y eliminar instrumentos del carrito.
* **Proceso de Pedido:** Simulación del flujo de compra.
* **Simulación de Pago:** Integración simulada con Mercado Pago.
* **Autenticación y Autorización:** Sistema de login y registro de usuarios con roles (Administrador, Cliente).
* **Vistas Dinámicas:** Interfaz de usuario que se adapta según el rol del usuario.
* **Gestión de Instrumentos (CRUD):** Funcionalidades para Crear, Leer, Actualizar y Eliminar instrumentos (disponible para administradores).
* **Gestión de Usuarios:** Administración de cuentas de usuario (disponible para administradores).
* **Estadísticas de la Tienda:** Visualización gráfica de datos relevantes (ventas, stock, etc.).
* **Exportación de Datos:** Descarga de información de la tienda en formato Excel y de detalles de instrumentos en formato PDF.

## Tecnologías Utilizadas

* **Backend:**
    * Java
    * Spring Boot
    * Maven / Gradle (Menciona el que uses)
    * RESTful API
* **Frontend:**
    * React
    * Vite
    * TypeScript
* **Base de Datos:**
    * MySQL
* **Otros:**
    * Mercado Pago API (Simulación)
    * Integración para exportación (Excel/PDF)

## Prerrequisitos

Antes de clonar y ejecutar este proyecto, asegúrate de tener instalado:

* Java Development Kit (JDK) [Especifica la versión si es relevante, ej: JDK 11 o superior]
* Maven
* Node.js 
* npm 
* MySQL Server

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/FiammaB/Tp5LabInstrumentosSpringBoot.git](https://github.com/FiammaB/Tp5LabInstrumentosSpringBoot.git)
    cd Tp5LabInstrumentosSpringBoot
    ```

2.  **Configuración de la Base de Datos MySQL:**
    * Crea una nueva base de datos en tu servidor MySQL (ej: `db_instrumentos`).
        ```sql
        CREATE DATABASE db_instrumentos;
        ```
  
3.  **Configuración y Ejecución del Backend (Spring Boot):**
    * Navega al directorio del backend:
        ```bash
        cd [Nombre de la Carpeta del Backend, ej: backend]
        ```
    * Configura la conexión a la base de datos:
        * Abre el archivo de propiedades/configuración de Spring Boot (usualmente `src/main/resources/application.properties` o `application.yml`).
        * Actualiza las propiedades de conexión a MySQL con los datos de tu base de datos local (URL, usuario, contraseña).
          ```properties
          # Ejemplo para application.properties
          spring.datasource.url=jdbc:mysql://localhost:3306/db_instrumentos?createDatabaseIfNotExist=TRUE&useSSL=FALSE&serverTimezone=UTC
          spring.datasource.username=[Tu Usuario de MySQL]
          spring.datasource.password=[Tu Contraseña de MySQL]
          spring.jpa.hibernate.ddl-auto=update # O "create", "create-drop" según tu configuración
          spring.jpa.show-sql=true
          ```
    * Construye y ejecuta la aplicación Spring Boot:
        * Con Maven:
            ```bash
            mvn clean install
            mvn spring-boot:run
            ```
        * Con Gradle:
            ```bash
            gradle build
            gradle bootRun
            ```
    * El backend se ejecutará típicamente en `http://localhost:8080`.

4.  **Configuración y Ejecución del Frontend (React con Vite):**
    * Abre una nueva terminal y navega al directorio del frontend:
        ```bash
        cd [Nombre de la Carpeta del Frontend, ej: frontend]
        ```
    * Instala las dependencias:
        * Con npm:
            ```bash
            npm install
            ```
        * Con Yarn:
            ```bash
            yarn install
            ```
    * Inicia la aplicación React:
        * Con npm:
            ```bash
            npm run dev
            ```
    
    * El frontend se ejecutará típicamente en `http://localhost:5173` (o un puerto similar).

## Uso

Una vez que el backend y el frontend estén ejecutándose, puedes acceder a la aplicación en tu navegador (usualmente `http://localhost:5173`).

* Puedes registrar nuevos usuarios o usar credenciales de prueba si el proyecto las incluye.
* Explora el catálogo, agrega instrumentos al carrito.
* Si accedes con un usuario administrador, deberías poder ver las opciones de gestión de instrumentos y usuarios, así como las estadísticas y opciones de exportación.

## Contribuciones

Este es un proyecto personal para mi portafolio. No busco contribuciones activas en este momento. Sin embargo, si encuentras algún problema o tienes sugerencias, no dudes en abrir un "Issue".


## Autor

* **Fiamma Brizuela**
   
    * LinkedIn (https://www.linkedin.com/in/fiamma-brizuela-16195224b)]

---



