import React from 'react';
import { Helmet } from 'react-helmet';

const IngresarVentas = () => {
  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap" />
        <link rel="icon" href="/img/icono-teach.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link href="//cdn.datatables.net/2.1.8/css/dataTables.dataTables.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/css/bootstrap.min.css" rel="stylesheet" />
        <title>TechCraft Dynamics</title>
      </Helmet>

      <div className="contenedor-dashboard">
        <Sidebar />
        <MainContent />
      </div>

      <Scripts />
    </>
  );
};

const Sidebar = () => {
  return (
    <aside className="barra-lateral">
      <div className="admin">
        <img src="/img/icon-admin.webp" alt="" width="80" height="80" />
        <h2>Administrador</h2>
      </div>

      <nav className="menu">
        <NavLink to="/Perfil_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z" />
          </svg>
          Perfil
        </NavLink>
        <NavLink to="/Ingreso_de_ventas_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
          </svg>
          Ingreso de ventas
        </NavLink>
        <NavLink to="/Gestion_de_usuarios_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Gestión de usuarios
        </NavLink>
        <NavLink to="/Gestion_de_categorias_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z" />
          </svg>
          Gestión de categorias
        </NavLink>
        <NavLink to="/Gestion_de_proveedores_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Gestion de proveedores
        </NavLink>
        <NavLink to="/Gestion_de_reportes_A" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z" />
          </svg>
          Gestion de reportes
        </NavLink>
        <NavLink to="/Cerrar_sesion" className="opcion">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M10 17l5-5-5-5v10zM4 4h2v16H4V4zm16 0h-6v2h6v12h-6v2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
          </svg>
          Salir
        </NavLink>

        <div className="logo">
          <img src="/img/IconoTech.png" alt="Logo" width="80" height="80" />
          <h2>TechCraft Dynamics</h2>
        </div>
      </nav>
    </aside>
  );
};

const MainContent = () => {
  return (
    <main className="contenido-principal">
      <div className="titulo">
        <h1>Ingresar ventas</h1>
      </div>
      <div className="contenedor-tabla">
        <div className="cards">
          <div className="card" onClick={() => window.location.href = '/admins/IngresarVentas.html'}>
            <span className="material-icons">shopping_cart</span>
            <h3>Punto de ventas</h3>
          </div>
          <div className="card" onClick={() => window.location.href = '/admins/ComprasProveedor.html'}>
            <span className="material-icons">inventory</span>
            <h3>Compras a proveedores</h3>
          </div>
        </div>
        
        <BarcodeScanner />
        <ProductsTable />
        <CurrentPurchase />
        <PaymentMethod />
        <ActionButtons />
      </div>
    </main>
  );
};

const BarcodeScanner = () => {
  return (
    <div className="codigoBarras">
      <a href="#">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -1000 1000 1000" width="30px" fill="green">
          <path d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z" />
        </svg>
        Escanear codigo de barras
      </a>
      
      <p>Sistema de escaneo para productos</p>
      <div className="escaneo">
        <input type="text" placeholder="Escanee el código de barras del producto" />
        <button type="submit">Buscar producto</button>
      </div>
      <div className="alert alert-warning mt-3" role="alert">
        Nota: si el producto no aparece, se recomienda agregarlo en la gestión de categorias.
      </div>
    </div>
  );
};

const ProductsTable = () => {
  const products = [
    { name: "Chunky razas adultos", price: "$25,000", image: "/img/chunky seco.jpg" },
    { name: "Chunky razas medianas", price: "$25,000", image: "/img/chunky 2.jpg" },
    { name: "Chunky razas pequeñas", price: "$25,000", image: "/img/chunky 3.jpg" },
    { name: "Pedegree humedo", price: "$18,000", image: "/img/hume.jpg" },
    { name: "Pedegree", price: "$18,000", image: "/img/pedi1.jpg" },
    { name: "Pechera para perros", price: "$18,000", image: "/img/ac6.jpg" },
    { name: "Cepillo", price: "$22,000", image: "/img/cep.jpg" },
    { name: "Cepillo dental", price: "$5,000", image: "/img/ac1.jpg" },
    { name: "Pelota", price: "$5,000", image: "/img/pelota6.jpg" },
    { name: "Iams para gatos: 10kg", price: "$12,000", image: "/img/comi.jpg" }
  ];

  return (
    <>
      <h4>Lista de productos</h4>
      <table id="tablaUsuarios">
        <thead>
          <tr>
            <th>Nombre del producto</th>
            <th>Precio</th>
            <th>Imagen del producto</th>
            <th>Agregar compra</th>
            <th>Eliminar compra</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td><img src={product.image} alt="" width="60px" /></td>
              <td>
                <button className="btn-icon">
                  <span className="material-icons">add_shopping_cart</span>
                </button>
              </td>
              <td>
                <button className="btn-icon">
                  <span className="material-icons">remove_shopping_cart</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const CurrentPurchase = () => {
  const currentProducts = [
    { name: "Producto 1", quantity: 2, price: "$25,000", total: "$50,000", image: "/img/ac1.jpg" },
    { name: "Producto 2", quantity: 2, price: "$25,000", total: "$50,000", image: "/img/ac2.jpg" },
    { name: "Producto 3", quantity: 2, price: "$25,000", total: "$50,000", image: "/img/ac3.jpg" }
  ];

  return (
    <div className="compraActual">
      <a href="" className="h5">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
        </svg>
        Compra actual
      </a>
      
      {currentProducts.map((product, index) => (
        <div className="producto1" key={index}>
          <div className="info">
            <h6>{product.name}</h6>
            <p>{product.quantity} x {product.price} = {product.total}</p>
          </div>
          <img src={product.image} alt="" />
          <button className="compra">
            <span className="material-icons">delete</span>
          </button>
        </div>
      ))}

      <div className="sub">
        <div className="NU">
          <h6>Subtotal: </h6>
          <h6>Total: </h6>
        </div>
        <div className="NU">
          <p>$150,000</p>
          <p>$150,000</p>
        </div>
      </div>
    </div>
  );
};

const PaymentMethod = () => {
  return (
    <div className="Metodo">
      <a href="" className="pago">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
        </svg>
        Metodos de pago
      </a>
      
      <select name="metodo" id="Met">
        <option value="">Seleccionar</option>
        <option value="">Tarjeta</option>
        <option value="">Efectivo</option>
        <option value="">Transferencia</option>
        <option value="">Nequi</option>
        <option value="">Daviplata</option>
      </select>

      <textarea name="texto" id="" placeholder="Descripcion de la venta (opcional)"></textarea>
    </div>
  );
};

const ActionButtons = () => {
  return (
    <>
      <div className="contenedor-botones">
        <button className="boton-pdf">
          <span className="material-icons">picture_as_pdf</span> PDF
        </button>
        <button className="boton-xls">
          <span className="material-icons">downloads</span> Descargar factura
        </button>
      </div>

      <div className="botonesFinales">
        <div className="B1">
          <button type="submit">Finalizar venta</button>
        </div>
        <div className="B2">
          <button type="submit"> Guardar como pendiente</button>
        </div>
        <div className="B3">
          <button type="submit">Canelar venta</button>
        </div>
      </div>
    </>
  );
};

const Scripts = () => {
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.4/dist/js/bootstrap.bundle.min.js"></script>
      <script type="module" src="/js/reportesadmin.js"></script>
      <script src="/js/Table.js"></script>
      <script src="/js/validacion.js"></script>
      <script src="/js/reportesadmin3.js"></script>
      <script src="/js/BotonesVentas.js"></script>
    </>
  );
};

export default IngresarVentas;