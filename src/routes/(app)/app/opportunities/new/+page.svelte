<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { Plus, Building2, Calendar, DollarSign, Target, ArrowLeft, Users } from 'lucide-svelte';

    /** @type {{ data: import('./$types').PageData, form?: import('./$types').ActionData }} */
    let { data, form } = $props();

    let isSubmitting = $state(false);
    /** @type {string[]} */
    let selectedContacts = $state([]);
    
    // Form data with defaults, including pre-selected account
    let formData = $state({
        name: form?.data?.name || '',
        accountId: form?.data?.accountId || data.preSelectedAccountId || '',
        stage: form?.data?.stage || 'PROSPECTING',
        amount: form?.data?.amount || '',
        closeDate: form?.data?.closeDate || '',
        probability: form?.data?.probability || '',
        type: form?.data?.type || '',
        leadSource: form?.data?.leadSource || '',
        nextStep: form?.data?.nextStep || '',
        description: form?.data?.description || '',
        ownerId: form?.data?.ownerId || ''
    });

    const opportunityStages = [
        { value: 'PROSPECTING', label: 'Prospecting', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
        { value: 'QUALIFICATION', label: 'Qualification', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        { value: 'PROPOSAL', label: 'Proposal', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
        { value: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
        { value: 'CLOSED_WON', label: 'Closed Won', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
        { value: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    ];

    const opportunityTypes = [
        'New Business',
        'Existing Business',
        'Renewal',
        'Upsell',
        'Cross-sell'
    ];

    const leadSources = [
        'Website',
        'Referral',
        'Cold Call',
        'Trade Show',
        'Advertisement',
        'Partner',
        'Social Media',
        'Email Campaign',
        'Other'
    ];

    /**
     * @param {string} contactId
     */
    function handleContactToggle(contactId) {
        if (selectedContacts.includes(contactId)) {
            selectedContacts = selectedContacts.filter(id => id !== contactId);
        } else {
            selectedContacts = [...selectedContacts, contactId];
        }
    }

    function calculateExpectedRevenue() {
        const amount = parseFloat(formData.amount);
        const probability = parseFloat(formData.probability);
        if (amount && probability) {
            return (amount * probability / 100).toFixed(2);
        }
        return 0;
    }

</script>

<svelte:head>
    <title>New Opportunity - BottleCRM</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-4">
                    <button
                        onclick={() => history.back()}
                        class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft class="w-5 h-5" />
                    </button>
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Target class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">New Opportunity</h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Create a new sales opportunity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Form -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {#if form?.error}
            <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-red-600 dark:text-red-400">{form.error}</p>
            </div>
        {/if}

        <form method="POST" action="?/create" use:enhance={() => {
            if (isSubmitting) {
                return;
            }
            
            isSubmitting = true;

            return async ({ result, update }) => {
                isSubmitting = false;
                await update();
                
                if (result.type === 'redirect') {
                    goto(result.location);
                }
            };
        }} class="space-y-8">
            <!-- Basic Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <Building2 class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Basic Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Opportunity Name -->
                    <div class="md:col-span-2">
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Opportunity Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            bind:value={formData.name}
                            required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter opportunity name"
                        />
                        {#if form?.errors?.name}
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.name}</p>
                        {/if}
                    </div>

                    <!-- Account -->
                    <div>
                        <label for="accountId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Account *
                        </label>
                        <select
                            id="accountId"
                            name="accountId"
                            bind:value={formData.accountId}
                            required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={!!data.preSelectedAccountId}
                        >
                            <option value="">Select an account</option>
                            {#each data.accounts as account}
                                <option value={account.id}>{account.name} {account.type ? `(${account.type})` : ''}</option>
                            {/each}
                        </select>
                        {#if data.preSelectedAccountId}
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Account pre-selected from {data.preSelectedAccountName}
                            </p>
                        {/if}
                        {#if form?.errors?.accountId}
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.accountId}</p>
                        {/if}
                    </div>

                    <!-- Stage -->
                    <div>
                        <label for="stage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stage *
                        </label>
                        <select
                            id="stage"
                            name="stage"
                            bind:value={formData.stage}
                            required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {#each opportunityStages as stage}
                                <option value={stage.value}>{stage.label}</option>
                            {/each}
                        </select>
                        {#if form?.errors?.stage}
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.stage}</p>
                        {/if}
                    </div>

                    <!-- Owner -->
                    <div>
                        <label for="ownerId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Owner
                        </label>
                        <select
                            id="ownerId"
                            name="ownerId"
                            bind:value={formData.ownerId}
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Assign to me</option>
                            {#each data.users as user}
                                <option value={user.id}>{user.name || user.email}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Type -->
                    <div>
                        <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            bind:value={formData.type}
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Select type</option>
                            {#each opportunityTypes as type}
                                <option value={type}>{type}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <!-- Financial Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                    <DollarSign class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Financial Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Amount -->
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            bind:value={formData.amount}
                            min="0"
                            step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="0.00"
                        />
                        {#if form?.errors?.amount}
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.amount}</p>
                        {/if}
                    </div>

                    <!-- Probability -->
                    <div>
                        <label for="probability" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Probability (%)
                        </label>
                        <input
                            type="number"
                            id="probability"
                            name="probability"
                            bind:value={formData.probability}
                            min="0"
                            max="100"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="0"
                        />
                        {#if form?.errors?.probability}
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.errors.probability}</p>
                        {/if}
                    </div>

                    <!-- Expected Revenue (calculated) -->
                    <div>
                        <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expected Revenue
                        </div>
                        <div class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white">
                            ${calculateExpectedRevenue()}
                        </div>
                    </div>

                    <!-- Close Date -->
                    <div>
                        <label for="closeDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expected Close Date
                        </label>
                        <input
                            type="date"
                            id="closeDate"
                            name="closeDate"
                            bind:value={formData.closeDate}
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <!-- Lead Source -->
                    <div>
                        <label for="leadSource" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Lead Source
                        </label>
                        <select
                            id="leadSource"
                            name="leadSource"
                            bind:value={formData.leadSource}
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Select source</option>
                            {#each leadSources as source}
                                <option value={source}>{source}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <!-- Additional Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Additional Information</h2>

                <div class="grid grid-cols-1 gap-6">
                    <!-- Associated Contacts -->
                    {#if data.accountContacts.length > 0}
                        <div>
                            <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Associated Contacts {data.preSelectedAccountId ? `from ${data.preSelectedAccountName}` : ''}
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                                {#each data.accountContacts as contact}
                                    <label class="flex items-center space-x-2 cursor-pointer hover:bg-white dark:hover:bg-gray-600 p-2 rounded">
                                        <input
                                            type="checkbox"
                                            name="contactIds"
                                            value={contact.id}
                                            checked={selectedContacts.includes(contact.id)}
                                            onchange={() => handleContactToggle(contact.id)}
                                            class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                        <span class="text-sm text-gray-900 dark:text-white">
                                            {contact.firstName} {contact.lastName}
                                            {#if contact.email}
                                                <span class="text-gray-500 dark:text-gray-400">({contact.email})</span>
                                            {/if}
                                        </span>
                                    </label>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Next Step -->
                    <div>
                        <label for="nextStep" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Next Step
                        </label>
                        <input
                            type="text"
                            id="nextStep"
                            name="nextStep"
                            bind:value={formData.nextStep}
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="What's the next step?"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            bind:value={formData.description}
                            rows="4"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Additional details about this opportunity..."
                        ></textarea>
                    </div>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onclick={() => history.back()}
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    {#if isSubmitting}
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                    {:else}
                        <Plus class="w-4 h-4 mr-2" />
                        Create Opportunity
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>