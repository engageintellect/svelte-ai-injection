<script lang="ts">
	import { onMount } from 'svelte';
	import { useChat } from 'ai/svelte';
	import { slide, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import robotImage from '$lib/images/robot14-nobg.png';

	import { getFormattedDateTime } from '$lib/utils';

	const { input, handleSubmit, messages } = useChat();
	let messagesEnd: HTMLElement;

	let githubRepo = 'https://github.com/engageintellect/svelte-ai-injection';

	let welcomeMessage = {
		id: 0,
		mainTitle: 'Hello, I am StonkBot.',
		mainHeading:
			'If you have ever used chatGPT, you will feel right at home. Additionally, I have a few features of my own, as I have access to real-time, third-party APIs that can provide the latest information on stocks, financial analysis, sentiment, and more. Feel free to ask me anything!',
		title2: `Let's get started.`,
		heading2:
			'If you would like to ask a question about a specific stock ticker, be sure to reference the ticker inside of curly brackets in within the context of your question. For example:',
		examples: [
			'"What is the current price of {AAPL}?"',
			'"What is the market cap of {COIN}?"',
			'"What is the current volume of {F}?"',
			'"Based on all the data of {META}, does anything stand out to you, and what is the sentiment? "'
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
			class="flex flex-grow items-center justify-center p-5 pb-28"
		>
			<div class="flex flex-col gap-5">
				<div class="flex flex-col items-center gap-10 sm:flex-row">
					<img
						src={robotImage}
						alt="Chat avatar"
						class="mx-auto w-48 rounded-full border border-primary bg-primary shadow"
					/>
					<div class="gap2 flex flex-col">
						<div class="text-3xl">{welcomeMessage.mainTitle}</div>
						<div class="font-thin">{welcomeMessage.mainHeading}</div>
					</div>
				</div>

				<div class="flex w-full flex-col gap-2 py-10 sm:flex-row sm:items-center">
					<div class="flex flex-col">
						<div class=" text-3xl">{welcomeMessage.title2}</div>
						<div class=" font-thin">{welcomeMessage.heading2}</div>
					</div>

					<ul class="chat chat-end flex w-full flex-col gap-2 px-5 text-primary">
						{#each welcomeMessage.examples as example}
							<li class="chat-bubble w-full">
								{example}
							</li>
						{/each}
					</ul>
				</div>

				<div class="">
					<div class="text-3xl">Contribute</div>
					<div>
						To contribute to this project, please submit a pull request to the <a
							class="text-primary underline"
							href={githubRepo}>GitHub Repository</a
						>.
					</div>
				</div>

				<div class="overflow-x-auto">
					<table class="table">
						<!-- head -->
						<thead>
							<tr class="border-b border-neutral">
								<th>Technology</th>
								<th>Use</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="text-primary">Sveltekit</td>
								<td>Client & Server Framework</td>
							</tr>
							<tr>
								<td class="text-primary">Vercel AI SDK</td>
								<td>Friendly APIs for streaming OpenAI data.</td>
							</tr>
							<tr>
								<td class="text-primary">OpenAI</td>
								<td>gpt3.5-turbo & gpt4</td>
							</tr>
							<tr>
								<td class="text-primary">YFinance</td>
								<td>Stock & Financial Data via Private VPS API.</td>
							</tr>
							<tr>
								<td class="text-primary">TailwindCSS</td>
								<td>Utility-based CSS framework.</td>
							</tr>
							<tr>
								<td class="text-primary">DaisyUI</td>
								<td>Tailwind Component Library.</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="flex items-center justify-center gap-1 pt-5 text-sm">
					<div>Made with</div>

					<div>
						<Icon icon="ri-heart-fill" class="" />
					</div>

					<div>
						by <a class="text-primary underline" href="https://github.com/engageintellect"
							>@engageintellect</a
						>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div in:fade={{ delay: 0, duration: 500 }} class="sticky top-[66px] z-10 p-2">
			<div class="inline-block">
				<button
					on:click={clearMessages}
					class="group btn flex items-center justify-center bg-base-300"
				>
					Clear Chat
					<Icon
						icon="ri-close-circle-fill"
						class="ml-2 h-7 w-7 text-error transition-all duration-300 sm:group-hover:scale-105"
					/>
				</button>
			</div>
		</div>

		<div class="flex-grow overflow-auto p-2 pb-28">
			{#each $messages as message (message.id)}
				<div class={message.role === 'assistant' ? 'chat chat-start' : 'chat chat-end'}>
					<div class="avatar chat-image">
						<div class="w-10 rounded-full border border-primary">
							<img
								alt="Chat avatar"
								class={message.role != 'assistant' ? '' : 'scale-x-[-1]'}
								src={message.role != 'assistant'
									? 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
									: robotImage}
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
						<!-- {JSON.stringify(message.content)} -->
						{@html message.content}
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
			type="text"
			placeholder="Ask something..."
			class="input input-bordered w-full focus:outline-none"
			bind:value={$input}
		/>
		<button type="submit" class="group btn btn-primary flex items-center">
			<div>Send</div>
			<Icon icon="ri-send-plane-fill" class="h-7 w-7 sm:group-hover:animate-pulse" />
		</button>
	</div>
</form>
