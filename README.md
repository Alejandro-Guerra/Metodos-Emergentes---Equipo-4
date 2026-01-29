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


## Backlog Inicial del Proyecto

### EPIC 1: Organización del Proyecto
- **HU-01:** Como equipo, queremos organizar el repositorio para trabajar de forma ordenada.
- **HU-02:** Como equipo, queremos definir una estrategia de ramas en Git para evitar conflictos.

### EPIC 2: Funcionalidades Básicas
- **HU-03:** Como usuario, quiero registrarme en el sistema.
- **HU-04:** Como usuario, quiero iniciar sesión para acceder a mis tareas.
- **HU-05:** Como usuario, quiero visualizar mis tareas asignadas.

### EPIC 3: Calidad y Control
- **HU-06:** Como equipo, queremos validar errores de entrada de datos.
- **HU-07:** Como equipo, queremos realizar pruebas básicas del sistema.


## Iteraciones y Objetivos por Sprint

### Sprint 1
- **Duración:** 1 semana  
- **Objetivo:** Organizar el proyecto y establecer bases técnicas.

**Tareas principales:**
- Crear estructura del repositorio  
- Definir roles  
- Configurar tablero Kanban  
- Definir estrategia de ramas  


### Sprint 2
- **Duración:** 1 semana  
- **Objetivo:** Desarrollar el MVP del sistema.

**Tareas principales:**
- Registro de usuarios  
- Inicio de sesión  
- Visualización básica de tareas  


### Sprint 3
- **Duración:** 1 semana  
- **Objetivo:** Mejorar calidad y estabilidad.

**Tareas principales:**
- Validaciones  
- Pruebas  
- Corrección de errores  
- Documentación final  


