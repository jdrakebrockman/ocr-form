<script lang="ts">
	import axios from 'axios';

	let files: FileList;
	let response: string;

	$: if (files) {
		// Note that `files` is of type `FileList`, not an Array:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileList
		console.log(files);

		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`);
		}
	}

	function validate() {
		if (files[0]) {
			let data: any = new FormData();
			data.append('file', files[0], files[0].name);

			axios
				.post('http://localhost:3000/ocr', data, {
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
</script>

<form on:submit|preventDefault={validate}>
	<label for="many">Upload file of any type:</label>
	<input bind:files id="many" type="file" />
	<button type="submit"> Please save me </button>
</form>

{#if files}
	<h2>Selected files:</h2>
	{#each Array.from(files) as file}
		<p>{file.name} ({file.size} bytes)</p>
	{/each}
{/if}

{#if response}
	{response}
{/if}
