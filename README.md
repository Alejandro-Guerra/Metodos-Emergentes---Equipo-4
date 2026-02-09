# Análisis de un Proyecto Fallido – Cubi

## Contexto del Proyecto

### Proyecto: Cubi

### Descripción general
Cubi es un proyecto de software cuyo objetivo es gestionar tareas y avisos para un grupo de usuarios, permitiendo la asignación de actividades, el seguimiento de avances y la retroalimentación.

### Estado del proyecto
El proyecto se considera **fallido** debido a retrasos constantes, falta de funcionalidades completas y problemas de coordinación entre los integrantes del equipo.

### Síntomas del fracaso
- Funcionalidades incompletas o mal integradas  
- Retrasos en las entregas  
- Conflictos frecuentes en el código  
- Falta de claridad en las responsabilidades del equipo  


## Problemas Identificados

### Problemas de Planificación

#### No existía un backlog definido
- **Evidencia:** Las tareas se asignaban verbalmente o por mensajes.
- **Impacto:** Trabajo duplicado y prioridades incorrectas.
- **Causa raíz:** No se definieron objetivos claros desde el inicio.

#### Alcance mal definido
- **Evidencia:** Cambios constantes en las funcionalidades.
- **Impacto:** Retrasos y frustración del equipo.
- **Causa raíz:** Falta de análisis inicial del proyecto.


### Problemas de Comunicación

#### Comunicación informal y no documentada
- **Evidencia:** Decisiones tomadas por chat sin registro.
- **Impacto:** Confusión y errores de implementación.
- **Causa raíz:** No se establecieron canales formales de comunicación.

#### Falta de reuniones de seguimiento
- **Evidencia:** No se revisaban avances ni bloqueos.
- **Impacto:** Problemas detectados demasiado tarde.
- **Causa raíz:** Falta de organización del equipo.


### Problemas de Integración de Código

#### Uso incorrecto del control de versiones
- **Evidencia:** Todos trabajaban directamente en la rama principal.
- **Impacto:** Conflictos y pérdida de código.
- **Causa raíz:** Desconocimiento de buenas prácticas en Git.

#### Ausencia de pruebas
- **Evidencia:** Errores detectados hasta fases finales.
- **Impacto:** Baja calidad del software.
- **Causa raíz:** No se consideró la fase de testing.



## Propuesta de Reestructuración con Kanban

### Roles del Equipo

- **Product Owner (PO):**  
- Grecia

- **Desarrollador Backend:**  
-Andy
-Chelsea Valdovinos Jijon

- **Desarrollador Frontend:**
-Rigel 
-Carla  

- **QA / Tester:**  
-Andrick Alejandro Guerra Guerra

### Políticas Kanban

#### Columnas del tablero
- Backlog  
- To Do  
- In Progress  
- Review / Testing  
- Done  

#### Límites de Trabajo en Progreso (WIP)
- **In Progress:** máximo 2 tareas por persona  
- **Review / Testing:** máximo 3 tareas  

#### Definición de “Done”
- Código integrado sin errores  
- Probado correctamente  
- Documentado  


## Backlog Inicial del Proyecto (HABITOS)

# Product Backlog — Proyecto Equipo 4

## Descripción general
Aplicación web para la gestión de hábitos personales y mascotas virtuales.  
El sistema es multiusuario y permite registrar hábitos, escribir un diario personal y administrar mascotas con estados de salud y felicidad.

**Tecnologías utilizadas**
- Frontend: HTML, CSS, React
- Backend: Node.js
- Base de datos: MongoDB

## EA — Sesión (Login / Registro)

- Registro de usuarios con nombre, correo electrónico y contraseña
- Validación de campos obligatorios
- Inicio de sesión con verificación de credenciales
- Manejo de errores de autenticación
- Cierre de sesión
- Encriptación de contraseñas


## EB — Mis Mascotas

- Visualización de la sección "Mis Mascotas"
- Mensaje informativo cuando no existen mascotas registradas
- Registro de mascota con nombre y tipo
- Almacenamiento de mascotas en la base de datos
- Visualización del estado de salud y felicidad de la mascota
- Acción de alimentar mascota
- Actualización automática del estado de la mascota
- Edición de datos de la mascota
- Eliminación de mascotas


## EC — Mis Hábitos

- Visualización de la sección "Mis Hábitos"
- Mensaje "No hay hábitos" cuando la lista está vacía
- Registro de hábitos con nombre, descripción e ícono
- Almacenamiento de hábitos en la base de datos
- Visualización de la lista de hábitos
- Edición de hábitos
- Eliminación de hábitos
- Posibilidad de agregar múltiples hábitos


## ED — Mi Diario

- Visualización de la sección "Diario"
- Creación de nuevas entradas
- Registro de la fecha de la entrada
- Selección del estado de ánimo
- Escritura del pensamiento del día
- Almacenamiento de entradas en la base de datos
- Visualización del historial de entradas
- Edición de entradas
- Eliminación de entradas


## EE — Backend y Base de Datos

- Configuración del servidor Node.js con Express
- Conexión a MongoDB
- Creación de modelos de datos:
  - Usuario
  - Mascota
  - Hábito
  - Diario
- Implementación de autenticación con JWT
- CRUD completo para cada módulo
- Asociación de datos por usuario (sistema multiusuario)


## EF — Frontend

- Estructura base de navegación
- Rutas protegidas para usuarios autenticados
- Formularios con validación
- Interfaces para:
  - Sesión
  - Mis Mascotas
  - Mis Hábitos
  - Mi Diario
- Manejo de estados de carga y error


## EG — Requisitos No Funcionales

- Validación y sanitización de datos
- Manejo de errores del sistema
- Documentación del proyecto
- Archivo README
- Datos de prueba
- Guía básica de despliegue


## Prioridad de Desarrollo

1. Autenticación y estructura base del sistema
2. Gestión de mascotas
3. Gestión de hábitos
4. Diario personal
5. Optimización, edición de datos y documentación


## Estado del Backlog

- Backlog inicial definido
- Basado en diagramas de flujo del sistema
- Listo para planificación Scrum o Kanban


