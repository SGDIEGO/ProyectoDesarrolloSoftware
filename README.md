# APLICACIÓN ESCRITORIO BIBLIOTECA

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Setup](#setup)

## 1. Tecnologías

### 1.1. Golang

- Un lenguaje de programación de código abierto compatible con Google.
- Fácil de aprender y excelente para equipos.
- Simultaneidad integrada y una biblioteca estándar sólida.
- Gran ecosistema de socios, comunidades y herramientas.

#### 1.1.1. Wails

Wails es un proyecto que te permite escribir aplicaciones de escritorio utilizando Go y tecnologías web. Considéralo una alternativa ligera y rápida a Electron para Go. Puedes crear aplicaciones fácilmente con la flexibilidad y el poder de Go, combinados con una interfaz rica y moderna.

### 1.2. TypeScript

TypeScript es un lenguaje de programación fuertemente tipado que se basa en JavaScript y proporciona mejores herramientas a cualquier escala.

#### 1.2.1. React

React es una biblioteca de JavaScript de código abierto diseñada para crear interfaces de usuario con el objetivo de facilitar el desarrollo de aplicaciones en una sola página. Es mantenido por Facebook y la comunidad de software libre.

#### 1.2.2. Vite

Vite es un servidor de desarrollo local escrito por Evan You, el creador de Vue.js, y utilizado de forma predeterminada por Vue y para las plantillas de proyectos de React. Tiene soporte para TypeScript y JSX. Utiliza Rollup y esbuild internamente para agrupar.

### 1.3. MySQL

MySQL es un sistema de gestión de bases de datos relacional desarrollado bajo licencia dual: Licencia pública general/Licencia comercial por Oracle Corporation. Es considerada como la base de datos de código abierto más popular del mundo y una de las más populares en general junto a Oracle y Microsoft SQL Server, todo para entornos de desarrollo web.

## 2. Instalación

### 2.1. Dependencias

- Golang (1.22.0+)
- NPM (Node 15+)
- WebView2 runtime

### 2.2. Verificar instalación de dependencias

#### a) Golang

Descarga Go desde la [Página de Descargas de Go](https://go.dev/dl/).

Asegúrate de seguir las instrucciones oficiales de instalación de Go. También debes asegurarte de que tu variable de entorno `PATH` incluya la ruta a tu directorio `~/go/bin`. Reinicia tu terminal y realiza las siguientes verificaciones:

- Verifica que Go esté instalado correctamente: `go version`
- Verifica que `~/go/bin` esté en tu variable `PATH`: `echo $PATH | grep go/bin`

#### b) NPM

Descarga NPM desde la [Página de Descargas de Node](https://nodejs.org/en/download/package-manager). Es mejor usar la versión más reciente, ya que es la que generalmente utilizamos para las pruebas.

- Ejecuta `npm --version` para verificar.

#### c) WebView2 runtime

Dependiendo del sistema operativo, hay diferentes maneras de instalar esta dependencia. Para Windows, sigue las instrucciones disponibles en [Wails Documentation](https://wails.io/docs/gettingstarted/installation) y [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/). Algunas instalaciones de Windows ya lo tendrán instalado. Puedes verificarlo usando el comando `wails doctor`.

#### d) Wails

Ejecuta el siguiente comando para instalar la CLI de Wails:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

Ejecutar `wails doctor` verificará si tienes las dependencias correctas instaladas. Si no es así, te indicará qué falta y te ayudará a corregir cualquier problema.

## 3. Setup

Sigue estos pasos para configurar y ejecutar la aplicación:

### 3.1. Descomprimir el archivo .rar

Descomprime el archivo `.rar` que contiene el proyecto en el directorio de tu elección.

Navega al directorio descomprimido donde encontrarás todos los archivos del proyecto.

### 3.2. Instalar las dependencias de npm para el frontend

Dentro del directorio del proyecto, abre una terminal y ejecuta el siguiente comando para instalar las dependencias necesarias para React:

```bash
npm install
```

### 3.3. Importar la base de datos

Abre MySQL Workbench o tu herramienta de gestión de bases de datos preferida.
Crea una nueva base de datos para el proyecto.
Importa el archivo libreriaDB.sql proporcionado en el archivo .rar:

En MySQL Workbench, ve a Server > Data Import.
Selecciona la opción para importar desde un archivo SQL y elige el archivo .sql incluido en el proyecto.
Ejecuta la importación para crear las tablas y datos necesarios en la base de datos.

### 3.4. Ejecución de la aplicación
Tienes dos opciones para ejecutar la aplicación:

#### 3.4.1. Ejecución de entorno de desarrollo

Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:

```bash
wails dev
```

Este comando ejecutará la aplicación en un entorno donde podrás ver los cambios en tiempo real mientras desarrollas.

#### 3.4.2. Compilar el proyecto para obtener el ejecutable
Si deseas generar un ejecutable de la aplicación listo para distribución, ejecuta:

```bash
wails build
```

Este comando creará un archivo ejecutable en el directorio build/bin que podrás distribuir y ejecutar en otros sistemas.

