<script lang="ts">
	import { onMount } from 'svelte';
	import { useChat } from 'ai/svelte';
	import { slide, fade } from 'svelte/transition';

	import Icon from '@iconify/svelte';

	const { input, handleSubmit, messages } = useChat();
	let messagesEnd: HTMLElement;

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
		$messages = [];
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col w-full max-w-3xl mx-auto">
	{#if $messages.length === 0}
		<div
			out:slide={{ delay: 0, duration: 500 }}
			in:fade={{ delay: 0, duration: 1500 }}
			class="flex-grow flex items-center justify-center p-5 py-10"
		>
			<div out:fade={{ delay: 0, duration: 1500 }} class="">
				<div class="text-3xl">{welcomeMessage.title}</div>
				<div class="text-xl font-thin">{welcomeMessage.heading}</div>
			</div>
		</div>
	{:else}
		<div class="sticky top-[68px] z-10 p-2">
			<div in:fade={{ delay: 0, duration: 500 }} class="inline-block">
				<button on:click={clearMessages} class="btn flex items-center justify-center">
					Clear Chat
					<Icon icon="ri-close-circle-fill" class="w-7 h-7 text-error ml-2" />
				</button>
			</div>
		</div>

		<div class="flex-grow overflow-auto pb-20 p-2">
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
					<div class="chat-header capitalize">
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
	{/if}
</div>
<form on:submit={handleSubmit} class="fixed w-full mx-auto bottom-0 bg-base-300 py-4 px-4">
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
