# Nuxt Custom Fetch

## Introduction

Often when working with Nuxt, you will need to fetch data from an API. Nuxt provides a handy wrapper for this called `useFetch`. Often you will want to have defaults for your fetch calls, such as a base URL, or headers. This is where a custom wrapper around `useFetch` can be useful.

## Setup

Start by creating a `composables` directory if you do not have one already. Inside this directory, create a file called `useMyFetch.ts`. This will be our custom wrapper around `useFetch`.

The code for the file is as below, however you may need to change the default settings to suit your needs.

```ts
import type { UseFetchOptions } from "nuxt/app";
import { defu } from 'defu'

export function useMyFetch<DataT, ErrorT>(url: string | (() => string), options: UseFetchOptions<DataT> = {}): ReturnType<typeof useFetch<DataT, ErrorT>>{
    const config = useRuntimeConfig();
    const headers = useRequestHeaders(['cookie']);
    const nuxtApp = useNuxtApp();

    const defaults: UseFetchOptions<DataT> = {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: headers,   
        onResponseError: async (error) => {
            // If we get a 401, then we need to log the user out
            if (error.response.status === 401) {
                // Navigate to the logout page to handle the logout      
                try {
                    await nuxtApp.runWithContext(() => navigateTo('/account/logout'));
                  } catch (e) {
                    console.error(e);
                  }

            }
        },
    };

    // Merge the options with the defaults
    const params = defu(options, defaults)
    
    // @ts-ignore - Reponse should always be a DataT or ErrorT
    return useFetch<DataT, ErrorT>(url, params);
}
```

## Explanation

The first thing we setup if our function definition. This is a generic function, in which we pass a `DataT` and `ErrorT` type. These are the types of the data we expect to receive from the API. For example, if we are fetching a list of users, then `DataT` would be `User[]` and `ErrorT` would be a type that represents the potential error object, in my case this is almost always a string. If you don't need to have types for the errors then you can just use a type for the data and not pass in the `ErrorT` type.

The return type of the function is the return type of `useFetch`. This is a tuple of the data and error types. We can use the `ReturnType` helper to get this type. This is required to ensure that your IDE can correctly infer the types of the data and error objects.

Next we outline the defaults for the request, in my cases often I want to have a base URL, and some headers. I also want to handle 401 errors, as this means the user is no longer authenticated and needs to be logged out. You can add any other defaults you want here.

Next we merge the options passed into the function with the defaults. This is done using the `defu` function. This function will merge the two objects, and if there are any conflicts, it will take the value from the second object. This is useful as it means we can override the defaults if we need to.

Finally we call `useFetch` with the merged options, and return the result. We currently have a ts-ignore here, as the TypeScript compiler complains about typing the resonse as we have done (i.e. null values are not handled correctly). This is not something we have to worry about in this case.

## Usage

To use the custom fetch, we simply import it into our component or composables, and use it as we would `useFetch`. For example:

```ts [./composables/useAccount.ts]
import type { User } from "~/types";

export const useAccount = () => {
    return {
        login(credential: string) {
            return useMyFetch<User, string>('/api/Account/Login', {
                method: 'POST',
                body: { credential }
            });
        },
    }
}
```

A good practice is to always have all your fetch calls in a separate file (i.e. as a composable), and then import them into your components. This makes it easier to test, and also makes it easier to change the implementation of the fetch calls if you need to.

In your components you would use them as follows:
    
```ts
<script setup lang="ts">
const { data, error, loading, fetch } = useAccount().login('my-credential');
</script>

<template>
    ...
</template>
```

## Conclusion

This is a simple way to create a custom wrapper around `useFetch` to provide defaults for your fetch calls. This is useful if you have a base URL, or headers that you want to use for all your fetch calls. It also allows you to handle errors in a consistent way, and to handle errors that are specific to your application.