# Logitravel Frontend Challenge

Aplicación para gestionar una lista de cadenas de texto. Implementada en dos versiones: Vanilla JS y React.

## Descripción

La app permite añadir y eliminar entradas de texto de una lista, con validaciones y mejoras de UX.

## Funcionalidades

### Requeridas

- [x] Contenedor donde se muestran las cadenas de texto
- [x] Input de texto para escribir nuevas entradas
- [x] Botón para agregar una entrada a la lista
- [x] Botón para eliminar la entrada seleccionada
- [x] No se pueden añadir entradas vacías
- [x] Los ítems son seleccionables; no se puede eliminar sin seleccionar antes
- [x] Selección múltiple y borrado de varios ítems a la vez
- [x] Eliminar ítem con doble click
- [x] Botón de deshacer (undo) el último cambio

## Estructura del proyecto

```
.
├── vanilla/          # Implementación en Vanilla JS
│   ├── index.html
└── react/            # Implementación en React
    ├── src/
    └── ...
```

## Implementaciones

### Vanilla JS

🔗 https://logitravel-frontend-challenge-45y6.vercel.app/

```bash
# O abrir directamente en el navegador
open vanilla/index.html
```

### React

🔗 https://logitravel-frontend-challenge.vercel.app/

```bash
cd react
npm i
npm run dev
```

Para ejecutar los tests:

```bash
npm test
```

## Decisiones técnicas

### Uso de `<dialog>`

Para el modal usé el elemento nativo `<dialog>` en lugar de un `<div>` con posicionamiento manual. Esto proporciona de forma gratuita:

- **Focus trapping**: el foco queda atrapado dentro del modal sin una línea de JavaScript adicional.
- **Escape para cerrar**: el navegador lo gestiona de forma nativa sin necesidad de un event listener propio.
- **Top layer**: el diálogo aparece siempre encima de cualquier otro elemento sin tocar `z-index`.
- **Accesibilidad**: el rol `dialog` y `aria-modal` se aplican automáticamente, por lo que los lectores de pantalla lo anuncian correctamente.

El coste es que `showModal()` y `close()` son APIs imperativas, lo que en React se traduce en un `useRef` y un `useEffect`. Además, jsdom no implementa el top layer nativo, por lo que en los tests es necesario mockear ambos métodos.

### `useList`

Toda la lógica de estado de la lista (añadir, eliminar, seleccionar, deshacer) vive en un único hook separado. Esto tiene dos ventajas concretas: los componentes quedan como vistas puras sin lógica propia, y el hook se puede testear de forma completamente aislada con `renderHook` sin necesidad de renderizar ningún componente.

### `setTimeout` para el doble click

El navegador dispara los eventos en este orden al hacer doble click: `click` → `click` → `dblclick`. Sin ninguna gestión adicional, los dos clicks procesarían la selección del ítem antes de que llegara el `dblclick` para borrarlo, provocando flickering visible en los botones de la UI.

La solución es envolver el handler del `click` en un `setTimeout` de 250ms. Si llega un `dblclick` antes de que el timer expire, se cancela el timer y el click nunca se procesa. 250ms está por debajo del umbral de doble click de la mayoría de sistemas operativos, por lo que un click simple sigue sintiéndose inmediato.

### Testing

- **`useList`**: cubre cada acción del hook usando `renderHook`. Al estar la lógica aislada, los tests no dependen de ningún componente.
- **`Modal`**: mockea `HTMLDialogElement.prototype.showModal` y `close` porque jsdom no implementa el top layer del navegador. Cubre la validación del formulario y el estado de error.
- **`Card`**: usa `vi.useFakeTimers()` para controlar el timer de 250ms y verificar que el click simple y el doble click se procesan de forma independiente.

### Undo ilimitado

El spec pedía deshacer "como mínimo el último cambio". La implementación mantiene un stack completo de acciones, por lo que el undo es ilimitado. Cada entrada del historial guarda el tipo de operación y los datos necesarios para revertirla: en el caso de eliminaciones, se guardan los índices originales para que los ítems se restauren exactamente en su posición anterior.

