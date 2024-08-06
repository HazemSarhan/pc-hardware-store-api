document
  .getElementById('updateProductForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const productId = formData.get('productId');

    // Prepare specifications as a JSON object
    let specifications;
    try {
      specifications = JSON.parse(formData.get('specifications'));
    } catch (error) {
      alert('Specifications must be a valid JSON string');
      return;
    }

    const productData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      specifications: specifications,
    };

    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const imageData = new FormData();
      imageData.append('image', imageFile);

      const imageResponse = await fetch(
        `http://localhost:5000/api/v1/products/uploadImage`,
        {
          method: 'POST',
          body: imageData,
        }
      );

      const imageResult = await imageResponse.json();
      if (imageResponse.ok) {
        productData.image = imageResult.image.src;
      } else {
        alert(imageResult.msg || 'Image upload failed');
        return;
      }
    }

    const response = await fetch(
      `http://localhost:5000/api/v1/products/${productId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      }
    );

    const result = await response.json();
    if (response.ok) {
      alert('Product updated successfully');
      // Optionally, redirect to another page
      // window.location.href = '/products.html';
    } else {
      alert(result.msg || 'Product update failed');
    }
  });