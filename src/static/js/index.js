const previewElement = document.getElementById("preview"); // img
const imagePicker = document.getElementById("image-picker"); // input
const imagePickerForm = document.getElementById("image-picker-form");
const resultsSection = document.getElementById("results");

class ImageReader {

    previewImage(image, element) {
        element.src = image;
    }

    readImage(file) {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsDataURL(file);
        });
    }
}

async function classifyImage(formData) {
    const options = {
        type: 'POST',
        url: '/classify',
        data: formData,
        contentType: false,
        cache: true,
        processData: false,
    };

    return $.ajax(options)
        .then((response) => response)
        .catch(error => {
            throw new Error(error)
        });
}

async function readImage(event) {
    reset();
    const formData = new FormData(imagePickerForm);
    const image = event.target.files[0];
    const imageReader = new ImageReader();

    // preview
    let base64Image = await imageReader.readImage(image);
    imageReader.previewImage(base64Image, previewElement);

    // classify
    let results = await classifyImage(formData);
    showResults(JSON.parse(results))
}

function showResults(results) {
    const ul = document.createElement("ul");
    resultsSection.appendChild(ul);

    for (let key in results) {
        if (results.hasOwnProperty(key)) {
            let value = key + " &#8211; " + results[key];
            let li = document.createElement("li");
            li.innerHTML = value;
            ul.appendChild(li);
        }
    }
}

function reset() {
    while (resultsSection.firstChild) {
        resultsSection.removeChild(resultsSection.firstChild);
    }
    previewElement.src = ""
}

imagePicker.addEventListener('change', readImage, false);