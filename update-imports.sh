#!/bin/bash
find /workspaces/opensource-startup-crm/src -type f -name "*.svelte" -exec sed -i "s/@lucide\/svelte/lucide-svelte/g" {} +
