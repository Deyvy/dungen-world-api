Estoy desarrollando un backend para una aplicación de hojas de personaje de un juego de rol de mesa inspirado en Dungeon World.

## STACK
- Backend: NestJS
- ORM: Prisma
- Base de datos: SQL relacional
- El frontend será independiente y consumirá una API REST.
- El proyecto utiliza una estructura de módulos personalizada, no necesariamente la estructura por defecto que genera NestJS.
- Ya tengo el proyecto funcionando y varias funcionalidades implementadas y probadas.

Quiero evitar duplicación de lógica. Si una funcionalidad nueva necesita una operación que ya existe, debemos reutilizar la lógica existente, idealmente extrayendo funciones reutilizables o permitiendo pasar el cliente transaccional de Prisma.

ARQUITECTURA CONCEPTUAL

Hay una separación clara entre:

## CONTENIDO DEL JUEGO

Define las cosas que existen en el juego y que son compartidas.

## ESTADO DEL PERSONAJE

Define qué ha elegido/adquirido/configurado cada personaje.

Por ejemplo:

- classContent = contenido disponible para una clase
- characters = información de un personaje
- characterContent = contenido adquirido por un personaje
- contentElements = componentes interactivos definidos para un contenido
- contentElementOptions = opciones disponibles para esos componentes
- characterElementValues = valores introducidos por el personaje
- characterElementOptions = opciones seleccionadas por el personaje
- spells = catálogo de hechizos
- spellLists = listas de hechizos asociadas a una clase
- characterSpells = hechizos que tiene actualmente un personaje

# MODELOS PRINCIPALES ACTUALES

Los modelos principales actuales se pueden encontrar en el schema.prisma.

# CLASES Y RELACIONES IMPORTANTES

La relación de hechizos es:

characters
    → class
    → spellLists
    → spells

No hay classId directamente en spells.

# SPELLS

Cantrips y prayers se consideran equivalentes a nivel de backend. No se necesita una distinción especial entre ambos.

Se utiliza spellLevel para distinguir niveles. Los cantrips/oraciones se representan con spellLevel = 0.

Los endpoints relacionados con spells que ya están implementados y probados son:

- hechizos disponibles para un personaje
- hechizos de un personaje
- añadir un hechizo
- olvidar un hechizo

La lógica conceptual es:

**GET** /characters/:id/spells/available → muestra los hechizos que el personaje puede obtener según su clase/nivel/reglas actuales y que todavía no están en characterSpells.

**GET** /characters/:id/spells
    → devuelve los hechizos que actualmente están en characterSpells.
    → la respuesta es una lista plana.
    → el frontend decide cómo agrupar/ordenar visualmente.

**POST** /characters/:id/spells/:spellId → añade el hechizo a characterSpells después de las validaciones correspondientes.

**DELETE** /characters/:id/spells/:spellId → elimina el hechizo de characterSpells.

La razón es que en la implementación actual, cuando el personaje sube de nivel, tiene disponibles todos los hechizos de ese nivel según las reglas del juego. Los hechizos que están en characterSpells representan los hechizos que tiene preparados/disponibles actualmente. Cuando olvida uno, se elimina de characterSpells.

**MOVIMIENTOS**

Los movimientos de clase están en classContent.

Hay dos tipos de movimientos:
- "INITIAL"
- "ADVANCED"

Los movimientos iniciales se asignan automáticamente al crear el personaje.

Al crear un personaje:
- se obtiene la clase
- se buscan los movimientos con:
    - classId = clase del personaje
    - type = "MOVE"
    - moveType = "INITIAL"
    - isActive = true
- se ordenan por sortOrder
- se insertan en characterContent.

Los movimientos avanzados tienen:
- moveType = "ADVANCED"
- levelRequired
- isActive

Ya están implementados y probados:

**GET** /characters/:id/moves/available

**POST** /characters/:id/moves/:contentId

Las validaciones de movimientos avanzados incluyen:
- personaje existente
- movimiento existente
- type = "MOVE"
- moveType = "ADVANCED"
- clase del movimiento coincide con la clase del personaje
- levelRequired permitido
- no duplicado
- activo

También está implementado:

**PUT** /characters/:id/moves/:contentId

Este endpoint permite guardar los elementos dinámicos de un movimiento.

Body de ejemplo:

{
    "elements": [
    {
    "elementId": 101,
    "value": "Kraken"
    },
    {
    "elementId": 102,
    "optionIds": [201, 203]
    }
    ]
}

La lógica:
- valida que el personaje posee el movimiento
- valida que los elementId pertenecen al movimiento
- valida que optionIds pertenecen al element
- valida min_select/max_select
- elimina los valores/opciones anteriores de esos elementos
- recrea el estado actual
- todo probado y funcionando

## ELEMENTOS DINÁMICOS

contentElements define componentes que forman parte de un contenido.

Puede haber:
- input/text value
- opciones seleccionables
- otros tipos según contentElementsType

contentElementOptions define las opciones posibles.

characterElementValues almacena valores introducidos por un personaje.

characterElementOptions almacena opciones seleccionadas.

**IMPORTANTE**: Se había recomendado añadir:

@@unique([character_id, element_id])

a characterElementValues para garantizar un único valor por personaje/elemento.

No asumir que está aplicado. Si se revisa esta parte, comprobar el schema actual antes de modificarlo.

## APARIENCIA

La apariencia del personaje ya está implementada.

Se decidió almacenar las diferentes líneas/partes de apariencia como registros separados en la tabla correspondiente.

Está probado y funcionando.

## CREACIÓN DEL PERSONAJE

La creación de personaje ya funciona.

Incluye:
- clase
- raza
- alineamiento
- equipo/opciones iniciales
- apariencia
- movimientos iniciales

También se implementó la validación para evitar asignar una raza si el personaje ya tiene una.

No rehacer esta funcionalidad salvo que encontremos un problema concreto.

## LEVEL UP

La subida de nivel ya está implementada y funciona según el diseño actual.

La idea conceptual es:

- subir +1 al nivel
- subir +1 una característica
- escoger/adquirir un movimiento

El endpoint de level-up puede orquestar estas operaciones y reutilizar funciones existentes.

Si se modifica esta funcionalidad:
- no duplicar lógica que ya existe
- utilizar transacciones Prisma cuando una operación modifica varias tablas
- recordar que try/catch es lo que hace rollback

La idea de arquitectura es:

**POST** /characters/:id/level-up

Body conceptual:

{
    stat: strength,
    moveId: "123"
}

## ESTRUCTURA DE MÓDULOS

Existe un módulo específico de spells.

Decisión tomada:

MODULE SPELLS
→ gestiona el catálogo de hechizos:
    - spells
    - spellLists
    - operaciones propias del catálogo

MODULE CHARACTERS
→ gestiona el estado del personaje:
    - characterSpells
    - movimientos adquiridos
    - valores de elementos
    - etc.

Por ejemplo:

**GET** /spells/:id → pertenece conceptualmente a spells.

**GET** /characters/:id/spells → pertenece conceptualmente a characters.

Los mappers siguen la misma regla.

El mapper de un spell genérico pertenece a spells.

El mapper de un hechizo perteneciente a un personaje pertenece a characters, por ejemplo:

characters/
    mapper/
    character-spell.mapper.ts

Esto ya está implementado y probado.

# OBJETIVOS YA COMPLETADOS

Ya están implementados y probados:

- creación de personaje
- mapper de personaje
- apariencia
- clase
- raza
- alineamiento
- opciones/equipo inicial
- movimientos iniciales
- movimientos avanzados disponibles
- adquirir movimiento avanzado
- elementos dinámicos de movimientos
- actualizar valores/opciones de elementos
- hechizos disponibles
- hechizos de personaje
- añadir hechizo
- olvidar hechizo
- subida de nivel
- restar/sumar puntos de vida

No vuelvas a implementar estos puntos desde cero.

# OBJETIVOS PENDIENTES

Los siguientes bloques previstos son:

## EQUIPAMIENTO DEL PERSONAJE

    - consultar equipo disponible
    - añadir/seleccionar equipo
    - eliminar/cambiar equipo
    - cantidades si las reglas lo requieren
    - validar que pertenece a las opciones permitidas

## BONDS
    - consultar bonds
    - crear/asignar bond
    - modificar/completar bond
    - eliminarlo si las reglas lo permiten

## RAZA Y ALINEAMIENTO

    - consultar razas de una clase
    - revisar ciclo completo
    - asignar al crear personaje
    - validar pertenencia a clase

## REVISIÓN DE MOVIMIENTOS

    - revisar reglas de progresión
    - iniciales
    - avanzados
    - elementos dinámicos
    - validaciones

## INVENTARIO Y CARGA MÁXIMA DEL PERSONAJE

    - Plantear guardado de la Carga máxima de la clase del personaje en la tabla de clases en la base de datos.
    - La carga máxima es la suma del número de la carga de la clase + strength del personaje.
    - La carga actual puede ser mayor a la carga máxima. El front-end controla si hay penalizaciones.
    - Plantear guardado de objetos consumibles con usos (raciones, pociones, municiones, etc.)

## REVISIÓN GENERAL DE SPELLS

    - Actualmente considerado terminado salvo que aparezca algún problema

## REVISIÓN DE APARIENCIA

    - **GET**
    - actualización

## VALIDACIONES DE NEGOCIO

    - clase/personaje
    - nivel mínimo
    - duplicados
    - pertenencia de opciones a elementos
    - pertenencia de movimientos a clase
    - pertenencia de spells a la lista de clase
    - min_select/max_select

## INTEGRIDAD Y TRANSACCIONES

    - operaciones multi-tabla deben ser atómicas
    - revisar constraints e índices
    - revisar especialmente characterElementValues

## ENDPOINTS GENERALES DE CHARACTER

    - **POST** /characters
    - **GET** /characters
    - **GET** /characters/:id
    - **PUT**/**PATCH** /characters/:id
    - **DELETE** /characters/:id

## DTOs Y MAPPERS

    - revisar consistencia
    - no exponer directamente estructuras internas de Prisma
    - validar inputs con DTOs

## AUTENTICACIÓN/AUTORIZACIÓN (IMPLEMENTAR EN UN FUTURO)

    - propietario del personaje
    - impedir acceso/modificación de personajes ajenos
    - proteger escritura

## TESTING (IMPLEMENTAR EN UN FUTURO)

    - unit tests
    - endpoint/integration tests
    - casos de error
    - casos límite

## DOCUMENTACIÓN API (IMPLEMENTAR EN UN FUTURO)

    - endpoints
    - params
    - body
    - responses
    - errores
    - flujos de creación y progresión

# ORDEN DE TRABAJO

No quiero que implementemos todo lo anterior de una vez.

Trabajaremos así:

## Elegir el siguiente objetivo.

- Revisar código existente relacionado si hace falta. 
- Diseñar la solución. 
- Implementar solo ese punto. 
- Probarlo. 
- Pasaremos al siguiente.

Ahora mismo, el siguiente bloque previsto es:

## EQUIPAMIENTO DEL PERSONAJE

Antes de escribir código:
- revisa primero qué modelos de Prisma existen actualmente relacionados con equipment/equipo.
- si no te los he proporcionado, pídemelos.
- no inventes modelos, relaciones ni nombres de campos.
- tampoco asumas que la estructura de equipo es igual a la de otra implementación de Dungeon World.

## ESTILO DE TRABAJO

- No inventes relaciones de Prisma.
- Si una relación no está clara, pregunta por el modelo antes de escribir el código.
- No cambies una decisión de diseño ya tomada salvo que exista una razón técnica clara.
- Prioriza reutilización de lógica.
- Usa transacciones Prisma cuando una operación implique varias modificaciones que deban ser atómicas.
- No dupliques endpoints ni lógica innecesariamente.
- Si consideras que una cosa se puede hacer de una forma mejor, aconséjame y explica el motivo por el cual es mejor dicha solución.

BASE DE DATOS:

- El acceso a la base de datos está en el .env.
- Si necesitas crear algún mockup o modificar algo en la base de datos, puedes pedirme permiso.