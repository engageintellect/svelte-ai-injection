<script lang="ts">
	import { onMount } from 'svelte';
	import { useChat } from 'ai/svelte';
	import { goto } from '$app/navigation';
	import { slide, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	const { input, handleSubmit, messages } = useChat();
	let messagesEnd: HTMLElement;
	let loading = false;

	let welcomeMessage = {
		id: 0,
		title: 'Hello! I am an AI assistant.',
		heading: 'Hello! I am an AI assistant. How can I help you today?'
	};

	onMount(() => {
		scrollToBottom();
	});

	$: $messages, scrollToBottom();

	function scrollToBottom() {
		if (messagesEnd) {
			messagesEnd.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function clearMessages() {
		console.log('Messages before', $messages);
		$messages = [];
		console.log('Messages cleared', $messages);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- {JSON.stringify($messages)} -->

{#if $messages.length === 0}
	<div
		transition:slide={{ delay: 0, duration: 500 }}
		class="flex items-center justify-center py-20"
	>
		<div out:fade={{ delay: 0, duration: 300 }} class="flex flex-col gap-2">
			<div class="text-3xl">{welcomeMessage.title}</div>
			<div class="text-xl font-thin">{welcomeMessage.heading}</div>
		</div>
	</div>
{:else}
	<div in:fade={{ delay: 0, duration: 1500 }} class="sticky top-[68px] -z-[-1]">
		<button on:click={() => clearMessages()} class="btn flex items-center">
			<div>Clear Chat</div>
			<Icon icon="ri-close-circle-fill" class="w-7 h-7 text-error" />
		</button>
	</div>
{/if}

<!-- <div class="text-3xl mb-4">useChat</div> -->
<div class="flex flex-col overflow-auto mb-auto" style="padding-bottom: 5rem;">
	{#each $messages as message (message.id)}
		<div class={message.role === 'assistant' ? 'chat chat-start' : 'chat chat-end'}>
			<div class="chat-image avatar">
				<div class="w-10 rounded-full">
					<img
						alt="Chat avatar"
						src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
					/>
				</div>
			</div>
			<div class="chat-header">
				{message.role}
				<time class="text-xs opacity-50">12:45</time>
			</div>
			<div
				class={message.role === 'assistant'
					? 'chat-bubble bg-primary text-primary-content'
					: 'chat-bubble'}
			>
				{message.content}
			</div>
			<div class="chat-footer opacity-50">Delivered</div>
		</div>
	{/each}
	<div bind:this={messagesEnd}></div>
</div>
<form on:submit={handleSubmit} class="fixed inset-x-0 bottom-0 bg-base-300 py-4 px-4">
	<div class="flex gap-2 items-center max-w-3xl mx-auto">
		<input
			autofocus
			type="text"
			placeholder="Ask something"
			class="input w-full input-bordered focus:outline-none"
			bind:value={$input}
		/>
		<button type="submit" class="btn btn-primary flex items-center">
			<div>Send</div>
			<Icon icon="ri-send-plane-fill" class="w-7 h-7" />
		</button>
	</div>
</form>
