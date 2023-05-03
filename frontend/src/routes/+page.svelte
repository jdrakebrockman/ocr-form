<script lang="ts">
	import axios from 'axios';

	let files: FileList;
	let response: string;
	let image: any;
	let placeholder;
	let showImage = false;

	function validate() {
		if (files[0]) {
			let data: any = new FormData();
			data.append('file', files[0], files[0].name);

			axios
				.post('http://localhost:3000/ocr/id', data, {
					headers: {
						accept: 'application/json',
						'Accept-Language': 'en-US,en;q=0.8',
						'Content-Type': `multipart/form-data; boundary=${data._boundary}`
					}
				})
				.then((r) => {
					response = r.data;
				})
				.catch((error) => {
					//handle error
				});
		}
	}

	function onChange() {
		const file = files[0];

		if (file) {
			showImage = true;

			const reader = new FileReader();
			reader.addEventListener('load', function () {
				image.setAttribute('src', reader.result);
			});
			reader.readAsDataURL(file);

			return;
		}
		showImage = false;
	}
</script>

<main class="container">
	<article class="flex">
		<form on:submit|preventDefault={validate}>
			<label for="many">Upload file of any type:</label>
			<input bind:files on:change={onChange} id="many" type="file" />
			<button type="submit"> Please save me </button>
		</form>

		<div>
			{#if showImage}
				<img bind:this={image} src="" alt="Preview" />
			{:else}
				<span bind:this={placeholder}>Image Preview</span>
			{/if}
		</div>
	</article>

	{#if response}
		<article>
			<h2>OCR content:</h2>

			{response}
		</article>
	{/if}
</main>

<style lang="css">
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 32px;
	}

	.flex > div {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 200px;
		flex: 1 1 0px;
		border: dashed 1px var(--form-element-color);
	}

	.flex > form {
		width: 100%;
		flex: 1 1 0px;
	}
</style>
