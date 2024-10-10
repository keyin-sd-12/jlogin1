// 2024-08-12

const low_stock_count = 10; // low stock count (red)
const warning_stock_count = 25; // warning stock count (yellow)
const stock_age_warning = 7; // stock age warning in months

// As of now (as a JS-newbie) I prefer not to use => functions
// I better understand the code with the traditional function syntax.

// fetch warehouse json report
fetch('./store.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // let's log all data to the console. It's multilevel nested data object 'store'.
    console.log('Main object "store":', data);
    console.log('');
    console.log('First level of JSON store warehouse file is "Product Categories":', data.store);
    // first level
    console.log(' -> "store.components" ( ID', data.store.components.id,'):', data.store.components);
    console.log(' -> "store.peripherals" ( ID', data.store.peripherals.id,'):', data.store.peripherals);
    console.log(' -> "store.monitors" ( ID', data.store.monitors.id,'):', data.store.monitors);
    console.log('');    
    console.log('For "store.monitors" second nest level is "Monitor Caterories":');
    // second level
    console.log(' -> "store.monitors.gaming.id" ( ID', data.store.monitors.gaming.id,'):', data.store.monitors.gaming.products);
    console.log(' -> "store.monitors.office.id" ( ID', data.store.monitors.office.id,'):', data.store.monitors.office.products);
    console.log(' -> "store.monitors.uhd.id" ( ID', data.store.monitors.uhd.id,'):', data.store.monitors.uhd.products);
    console.log(' -> "store.monitors.curved.id" ( ID', data.store.monitors.curved.id,'):', data.store.monitors.curved.products);
    console.log('');
    console.log('Further down to third level "Products", list all UHD monitors by .forEach method:');
    // third level
    data.store.monitors.uhd.products.forEach(function(product) {
      console.log(`=== Product ID: ${product.id} ===`);
      console.log(` -> Product Name: ${product.product}`);
      console.log(` -> Price: $${product.price}`);
      console.log(` -> Stock: ${product.stock}`);
      console.log(` -> Date First Available: ${product.date_first_available}`);
    });
    console.log('');
    console.log('or can find a specific product by ID using .find method:');
    console.log('data.store.monitors.uhd.products.find(p => p.id === "03-03-003")');
    //const product = data.store.monitors.uhd.products.find(p => p.id === "03-03-003");
    let product = data.store.monitors.uhd.products.find(function(p) { return p.id === "03-03-003"; });
    console.log(product);
    console.log('');
    console.log('or can filter products by price using .filter method:');
    console.log('data.store.monitors.uhd.products.filter(p => p.price < 400)');
    product = data.store.monitors.uhd.products.filter(function(p) {
       return p.price < 400; 
      });
    product.forEach(function(product) {
      console.log(`--> Product ID: ${product.id}, Name: ${product.product}, Price: $${product.price}`);
    });
    console.log('');
    console.log('or by quantity available looking for products need to be restocked:');
    console.log('data.store.monitors.uhd.products.filter(p => p.stock < 10)');
    product = data.store.monitors.uhd.products.filter(function(p) { return p.stock < 10; });
    product.forEach(function(product) {
      console.log(`--> Product ID: ${product.id}, Name: ${product.product}, Stock: ${product.stock}`);
    });
    console.log('');
    console.log('Can define functions to work with this data:');
    console.log('=== Function "list_products_and_calculate_total_cost" ===');
    console.log('');    
    console.log('UHD Monitors:');
    list_products_and_calculate_total_cost(data.store.monitors.uhd.products);

    console.log('');    
    console.log('ALL PRODUCTS IN WAREHOUSE:');
    let all_products = list_of_all_products_in_store(data);
    list_products_and_calculate_total_cost(all_products)

    // another way to loop through the whole data object
    // using Object.keys() method
    console.log('')
    console.log('****** Another way to loop through all the products ******');
    console.log('             (using Object.keys() method)');
    full_store_list(data);
    
    console.log('')
    console.log('-----> NOW PRINT TO HTML PAGE');
  html_warehouse_report(data);

// the end of the fetch function
})
.catch(function(error) {
  // logs any errors that occur during the fetch or processing of data.
  console.error(error);
});


// function to calculate age in months
function calculate_age_in_months(start_date, end_date) {
  const start_d = typeof start_date === 'string' ? new Date(start_date) : start_date;
  const end_d = typeof end_date === 'string' ? new Date(end_date) : end_date;
  const diff_in_ms = end_d - start_d;
  const diff_in_mo = Math.floor(diff_in_ms / (1000 * 60 * 60 * 24 * 30));
  return diff_in_mo;
}

// function to list products and calculate their total cost
function list_products_and_calculate_total_cost(products) {
  let total_cost = 0;
  products.forEach(function(product) {
    console.log(` - ${product.product}, Price: $${product.price}, Qty: ${product.stock}`);
    total_cost += parseFloat(product.price) * parseFloat(product.stock);
  });
  console.log(`Total cost in warehouse: $${total_cost}`);
}

// function to list all products in the store using recursion
function list_of_all_products_in_store(data) {
  let all_products = [];
  function loop_through_section(section) {
    // check is section has products property
    if (section.products && section.products.length > 0) {
      all_products = [...all_products, ...section.products]; // spread operator
      // or use "all_products = all_products.concat(section.products);""
    } else {
      // recursive call to loop through subcategories further down
      // only do that if sub_section is an object and not null
      for (let sub_section in section) { 
        if (typeof section[sub_section] === 'object' && section[sub_section] !== null) {
          loop_through_section(section[sub_section]); }
      }
    }
  }  
  // call the function with the main data object, and it will loop through all the sections down
  loop_through_section(data.store);
  return all_products;
}

// loop through all the products in the store using Object.keys() method
function full_store_list(data) {
  Object.keys(data.store).forEach(function(section) {
    console.log('')
    console.log(`== ${section.toUpperCase()} - Section ${data.store[section].id} ==`);
    // loop through the subsections
    Object.keys(data.store[section]).forEach(function(sub_section) {
      if (sub_section !== "id") {
        console.log('')
        console.log(` * ${sub_section.toUpperCase()} - Section ${data.store[section][sub_section].id} *`);
      }
      // check if sub_section and products are defined and products is an array
      // otherwise get error, we have ids in subsections without products
      if (data.store[section][sub_section] && Array.isArray(data.store[section][sub_section].products)) {
        // loop through the products
        data.store[section][sub_section].products.forEach(function(product) {
          console.log(`- ID: ${product.id}, Prod: ${product.product}, Cost: $${product.price}, Qty: ${product.stock}, Date: ${product.date_first_available}`);
        });
      } else {   
          console.log(`No products found in sub_section: ${sub_section}`);
          console.log(`data.store[section][sub_section]:`, data.store[section][sub_section]);
      }
    });
  }); 
}

// function to create HTML report
function html_warehouse_report(data) {

  const container = document.createElement('div');
  container.id = 'store_container';

  const todays_date = new Date();
  var warehouse_total = 0;
  var section_total = 0;
  var subsection_total = 0;

  const date_format = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted_date = todays_date.toLocaleDateString('en-US', date_format);

  const date_div = document.createElement('div');
  date_div.className = 'date';
  date_div.innerHTML = `<h2>${formatted_date}</h2>`;
  container.appendChild(date_div);

  // loop through the sections
  Object.keys(data.store).forEach(function(section) {
    
    section_total = 0;
    const section_div = document.createElement('div');
    section_div.className = 'section';
    section_div.innerHTML = `<h2 class="h2s">${section.toUpperCase()} (${data.store[section].id.toUpperCase()})</h2>`;
  
    // loop through the subsections
    Object.keys(data.store[section]).forEach(function(sub_section) {
      if (sub_section !== "id") {
        const subsection_div = document.createElement('div');
        subsection_div.className = 'subsection';
        subsection_div.innerHTML = `<h3>${sub_section.toUpperCase()} (${data.store[section][sub_section].id.toUpperCase()})</h3>`;
  
        if (data.store[section][sub_section] && Array.isArray(data.store[section][sub_section].products)) {

          const table = document.createElement('table');
          table.className = 'product-table';
          const thead = table.createTHead();
          const tbody = table.createTBody();
  
          // headings
          const th_row = thead.insertRow();
          th_row.innerHTML = `
            <th>ID</th>
            <th>Product</th>
            <th>Cost</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Age</th>
          `;

          // loop through the products
          subsection_total = 0;
          data.store[section][sub_section].products.forEach(function(product, index) {
            // row for each product
            product_total = parseFloat(product.price) * parseFloat(product.stock);
            subsection_total += product_total;
            const product_age = calculate_age_in_months(product.date_first_available, todays_date);              
            const tr_row = tbody.insertRow();
            tr_row.innerHTML = `
              <td>${product.id}</td>
              <td>${product.product}</td>
              <td>$${product.price.toFixed(2)}</td>
              <td>${product.stock}</td>
              <td>$${product_total.toFixed(2)}</td>
              <td>${product_age === 0 ? 'NEW' : `${product_age} mo`}</td>
            `;

            if (product.stock <= low_stock_count) {
              tr_row.cells[3].className = 'low-stock';
            } else if (product.stock > low_stock_count && product.stock < warning_stock_count) {
              tr_row.cells[3].className = 'medium-stock';
            } else {
              tr_row.cells[3].className = 'high-stock';
            }

            if (product_age >= stock_age_warning) {
              tr_row.cells[5].className = 'clearance';
            }

            tr_row.className = index % 2 === 0 ? 'even-row' : 'odd-row';
          });

          // subsection total
          const totals_row = tbody.insertRow();
          totals_row.className = 'subsection-total';
          totals_row.innerHTML = `
            <td colspan="4" style="text-align: right;">Subsection Total:</td>
            <td style="text-align: right;">$${subsection_total.toFixed(2)}</td>
          `;

          subsection_div.appendChild(table);
        } else {
          subsection_div.innerHTML += `<p>No products found in this subsection.</p>`;
        }
        section_total += subsection_total;
        section_div.appendChild(subsection_div);
      }
    });

    // section total
    const sectionTotalDiv = document.createElement('div');
    sectionTotalDiv.className = 'section-total';
    sectionTotalDiv.innerHTML = `<h2> Section Total: $${section_total.toFixed(2)}</h2>`;
    section_div.appendChild(sectionTotalDiv);

    warehouse_total += section_total;
    container.appendChild(section_div);
  });
  
  // warehouse total
  const warehouse_total_div = document.createElement('div');
  warehouse_total_div.className = 'warehouse-total';
  warehouse_total_div.innerHTML = `<h2> Warehouse Total: $${warehouse_total.toFixed(2)}</h2>`;
  container.appendChild(warehouse_total_div);

  document.getElementById('store_div').appendChild(container);

// end html_warehouse_report function  
}  
