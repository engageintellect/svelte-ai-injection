<script lang="ts">
	import { onMount } from 'svelte';
	import { useChat } from 'ai/svelte';
	import { slide, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	import { getFormattedDateTime } from '$lib/utils';

	const { input, handleSubmit, messages } = useChat();
	let messagesEnd: HTMLElement;

	let githubRepo = 'https://github.com/engageintellect/svelte-ai-injection';

	let welcomeMessage = {
		id: 0,
		mainTitle: 'Hello! I am an AI assistant.',
		mainHeading:
			'If you have ever used chatGPT, you will feel right at home. Additionally, I have a few special features as I have access to real-time, third-party APIs that can provide the latest information on stocks and finance.	',
		title2: 'Finance Chat',
		heading2:
			'If you would like to ask a question about a specific stock ticker, be sure to reference the ticker inside of curly brackets in your question. For example:',
		examples: [
			'"What is the current price of {AAPL}?"',
			'"What is {META} short float percentage at?"',
			'"What is the market cap of {COIN}?"',
			'"What is the current volume of {F}?"'
		],

		title3: 'hello world',
		heading3: 'hello world'
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
		// TODO: This is a hack to force a re-render. Find a better way to do this.
		// window.location.reload();
		// window.scrollTo(0, 0);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="mx-auto flex w-full max-w-3xl flex-col">
	{#if $messages.length === 0}
		<div
			out:slide={{ delay: 0, duration: 500 }}
			class="flex flex-grow items-center justify-center p-5 py-10 pb-20"
		>
			<div out:fade={{ delay: 0, duration: 500 }} class="flex flex-col gap-5">
				<div class="gap2 flex flex-col">
					<div class="text-3xl">{welcomeMessage.mainTitle}</div>
					<div class="font-thin">{welcomeMessage.mainHeading}</div>
				</div>

				<div class="gap2 flex flex-col">
					<div class="text-3xl">{welcomeMessage.title2}</div>
					<div class="font-thin">{welcomeMessage.heading2}</div>

					<ul class="chat chat-end flex flex-col gap-2 p-5 text-primary">
						{#each welcomeMessage.examples as example}
							<li class="chat-bubble">
								{example}
							</li>
						{/each}
					</ul>
				</div>

				<div class="py-10">
					<div class="text-3xl">Contribute:</div>
					<div>
						To contribute to this project, please submit a pull request to the <a
							class="text-primary"
							href={githubRepo}>GitHub Repository</a
						>.
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div in:fade={{ delay: 0, duration: 1000 }} class="sticky top-[68px] z-10 p-2">
			<div in:fade={{ delay: 0, duration: 500 }} class="inline-block">
				<button on:click={clearMessages} class="btn flex items-center justify-center bg-base-300">
					Clear Chat
					<Icon icon="ri-close-circle-fill" class="ml-2 h-7 w-7 text-error" />
				</button>
			</div>
		</div>

		<div class="flex-grow overflow-auto p-2 pb-20">
			{#each $messages as message (message.id)}
				<div class={message.role === 'assistant' ? 'chat chat-start' : 'chat chat-end'}>
					<div class="avatar chat-image">
						<div class="w-10 rounded-full">
							<img
								alt="Chat avatar"
								src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							/>
						</div>
					</div>
					<div class="chat-header flex items-center gap-2 capitalize">
						{message.role}
						<time class="text-xs opacity-50">{getFormattedDateTime()}</time>
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
<form on:submit={handleSubmit} class="fixed bottom-0 mx-auto w-full bg-base-300 px-4 py-4">
	<div class="mx-auto flex max-w-3xl items-center gap-2">
		<input
			autofocus
			type="text"
			placeholder="Ask something"
			class="input input-bordered w-full focus:outline-none"
			bind:value={$input}
		/>
		<button type="submit" class="btn btn-primary flex items-center">
			<div>Send</div>
			<Icon icon="ri-send-plane-fill" class="h-7 w-7" />
		</button>
	</div>
</form>
