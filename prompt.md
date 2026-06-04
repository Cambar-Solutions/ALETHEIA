Objetivo

Realiza una revisión completa de UX/UI y navegación de todo el proyecto. Puedes modificar cualquier componente, layout, página, estilo global, sistema de diseño o flujo de navegación necesario para lograr una experiencia moderna, consistente y profesional.

No quiero cambios mínimos ni superficiales. Quiero una mejora integral del producto, manteniendo la funcionalidad existente.

Prioridad Máxima: Calidad Visual

Analiza toda la aplicación y corrige cualquier problema de:

Jerarquía visual.
Espaciado inconsistente.
Alineaciones incorrectas.
Tamaños de texto poco equilibrados.
Componentes visualmente pobres.
Navegación confusa.
Experiencia poco profesional.

Toma como referencia productos SaaS modernos de alta calidad como:

Notion
Linear
Stripe Dashboard
Vercel
GitHub
Figma

La interfaz debe sentirse premium, limpia y consistente.

Sistema de Diseño

Elimina la dependencia visual de tonos grises excesivos.

Paleta principal:

Negro (#000000)
Blanco (#FFFFFF)
Azul primario actual del proyecto
Un color secundario complementario que combine con el azul y aporte personalidad al producto

Requisitos:

Alto contraste.
Excelente accesibilidad.
Estados visuales claros.
Hover states consistentes.
Focus states visibles.
Sombras modernas y sutiles.
Bordes coherentes en toda la aplicación.

Crea o mejora un sistema de diseño reutilizable para evitar inconsistencias futuras.

Branding

Actualmente el logo está ausente en gran parte de la aplicación.

Requisitos:

Mostrar el logo oficial donde tenga sentido.
Eliminar placeholders como la letra "A" sobre fondo de color primario.
Utilizar el branding real de forma consistente.
Dar más protagonismo al logo en pantallas clave.

Login:

El logo debe ser significativamente más grande.
Debe transmitir identidad de producto.
Debe verse profesional y bien integrado.
Pantalla de Login

Problemas actuales:

El formulario se ve pequeño.
La distribución visual está desequilibrada.

Requisitos:

Layout dividido aproximadamente 50/50.
Sección visual de branding más atractiva.
Formulario con mejor presencia visual.
Excelente experiencia tanto en desktop como en tablet y móvil.
Sensación de producto SaaS moderno.
Navegación

Realiza una auditoría completa de la navegación.

Problemas observados:

Hay momentos donde el historial parece comportarse incorrectamente.
Ejemplo:
Estoy en /reportes.
Presiono "atrás".
Soy enviado temporalmente al login.
Después de aproximadamente un segundo la aplicación redirige nuevamente.

Investiga la causa raíz.

Posibles áreas a revisar:

React Router / Next Router.
Guards de autenticación.
Middleware.
Redirects automáticos.
Manejo del historial del navegador.
Persistencia de sesión.
Race conditions durante la hidratación.

Objetivo:

Navegación instantánea.
Sin flickering.
Sin redirecciones incorrectas.
Historial consistente.
Botones y Acciones

Detecta y corrige:

Botones desalineados.
Acciones inconsistentes.
Diferencias de tamaño.
Diferencias de espaciado.

Requisitos:

Todos los botones deben seguir el mismo sistema visual.
Hover states claros.
Transiciones suaves.
Estados disabled consistentes.
Estados loading consistentes.
Botón "Volver"

Estandarizar completamente la navegación hacia atrás.

Requisitos:

Debe existir una estrategia consistente para todas las pantallas.
Debe ser fácil de encontrar.
Debe mantener la misma posición visual.
Debe utilizar el mismo componente reutilizable.
Editor de Contratos y Plantillas

Esta es una de las áreas más importantes.

Problema:

El editor actual tiene una UX deficiente.

Objetivo:

Rediseñarlo tomando inspiración de:

Google Docs
Notion
Microsoft Word Online

Requisitos:

Interfaz limpia.
Barra de herramientas intuitiva.
Espaciado adecuado.
Mejor experiencia de edición.
Mejor visualización de documentos.
Flujo de trabajo más natural.
Componentes profesionales.
Mejor manejo visual de plantillas y contratos.

No quiero un editor complejo; quiero uno extremadamente usable.

Responsive Design

Revisa toda la aplicación.

Garantiza:

Desktop.
Laptop.
Tablet.
Mobile.

No deben existir:

Overflows.
Elementos cortados.
Botones fuera de pantalla.
Layout shifts.
Refactor Permitido

Puedes:

Reorganizar layouts.
Crear componentes reutilizables.
Crear design tokens.
Crear componentes base.
Consolidar estilos duplicados.
Mejorar arquitectura visual.

No rompas funcionalidades existentes.

Entregables

Al finalizar:

Resume todos los cambios realizados.
Explica los problemas encontrados.
Explica cómo fueron solucionados.
Lista cualquier mejora adicional implementada por iniciativa propia.
Menciona cualquier deuda técnica detectada que valga la pena resolver posteriormente.

Antes de implementar, analiza todo el proyecto para identificar patrones visuales inconsistentes y propón la mejor solución global en lugar de aplicar correcciones aisladas.