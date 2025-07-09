// import para el Link 
import { Link } from 'react-router-dom';

// Importacion del css
import '../../css/Categorias/Categorias.css'

export default function Categorias(){
    return(
        <>
            <h1 className="titulo">PANEL PRINCIPAL</h1>   
            {/* Contenedor trasero */}
            <main className="contenedor-principal">

                {/* Boton para ir a el listado de categorias */}
                <Link to="/admin/Categorias/Listado">
                    <button className="G-categorias"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>Gestionar categorias</button>
                </Link>
                    
                        {/* Seccion donde se visualiza los productos mas vendidos 4xC.U */}               
                    <section id="mas-vendidos" className="mas-vendidos">
                        <h2 className="Mas-V">Productos Más Vendidos</h2>           
                        
                        {/* Proximamente la tabla pasara a map */}
                        <table  className="Mejores">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Ventas</th>
                                    <th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Alimento Premium para Perros</td>
                                    <td>120 unidades</td>
                                    <td>$50,000</td>
                                </tr>
                                <tr>
                                    <td>Juguete de Peluche</td>
                                    <td>95 unidades</td>
                                    <td>$20,000</td>
                                </tr>
                                <tr>
                                    <td>Cama Grande para Mascotas</td>
                                    <td>80 unidades</td>
                                    <td>$120,000</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="galeria-productos">
                            <div className="producto">
                                <img src="" alt="Imagen del producto" className="I-producto" />
                                <h3>Alimento Premium</h3>
                                <p>$50,000</p>
                            </div>
                            <div className="producto">
                                <img src="" alt="Imagen del producto" className="I-producto" />
                                <h3>Juguete para Gatos</h3>
                                <p>$20,000</p>
                            </div>
                            <div className="producto">
                                <img src="" alt="Imagen del producto" className="I-producto" />
                                <h3>Cama para Mascotas</h3>
                                <p>$120,000</p>
                            </div>
                            <div className="producto">
                                <img src="" alt="Imagen del producto" className="I-producto" />
                                <h3>Shampoo para Perros</h3>
                                <p>$25,000</p>
                            </div>
                        </div>            
                    </section>
                            {/* Seccion donde se visualiza los productos mas vendidos 4xC.U */}
                <section id="menos-vendidos" className="menos-vendidos">
                    <h2 className="Menos-V">Productos Menos Vendidos</h2>

                    {/* Tabla para pasar a map */}
                    <table className="Peores">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Ventas</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Correa Sencilla</td>
                                <td>5 unidades</td>
                                <td>$15,000</td>
                            </tr>
                            <tr>
                                <td>Shampoo para Gatos</td>
                                <td>3 unidades</td>
                                <td>$25,000</td>
                            </tr>
                            <tr>
                                <td>Casa para Hámsters</td>
                                <td>1 unidad</td>
                                <td>$45,000</td>
                            </tr>
                            
                        </tbody>
                    </table>

                    <div className="galeria-productos">
                        <div className="producto">
                            <img src="" alt="Imagen de productos" className="I-producto" />
                            <h3>Correa Sencilla</h3>
                            <p>$50,000</p>
                        </div>
                        <div className="producto">
                            <img src="" alt="Imagen de productos" className="I-producto" />
                            <h3>Casa para Hámsters</h3>
                            <p>$20,000</p>
                        </div>
                        <div className="producto">
                            <img src="" alt="Imagen de productos" className="I-producto" />
                            <h3>Shampoo Para Gatos</h3>
                            <p>$120,000</p>
                        </div>
                        <div className="producto">
                            <img src="" alt="Imagen de productos" className="I-producto" />
                            <h3>Shampoo Para Gatos 2</h3>
                            <p>$120,000</p>
                        </div>
                    </div>           
                </section>
            </main>
        </>
    );
}