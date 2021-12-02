# Svelte Expirable store

A Svelte store with items that expire

## Installation

```
npm install @macfja/svelte-expirable
```

## Usage

`notification.js`
```javascript
import { expirable } from "@macfja/svelte-expirable"

export const notifications = expirable()
```

`App.svelte`
```html
<script>
    import { notifications } from './notifications.js'
    
    const onClickHandler = () => {
        // Do some action
        notifications.push('Data saved', 2) // Message expire after 2 seconds
    }
</script>

<header>
    {#each $notifications as {data, id, repeated} (id)}
        <div class="message">{data}{#if repeated > 0} (x{repeated + 1}){/if}</div>
    {/each}
</header>
```

When the same data is push to the store, the expiration time is reset to the new TTL, and the `repeated` variable is incremented

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Read more in the [Contributing file](CONTRIBUTING.md)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.