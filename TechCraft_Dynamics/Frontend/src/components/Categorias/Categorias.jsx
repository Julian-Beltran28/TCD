// import para el Link 
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// Importacion del css
import '../../css/Categorias/Categorias.css'

export default function Categorias() {

    useEffect(() => {
        // Activar movimiento tipo "drag"
        const carruseles = document.querySelectorAll('.galeria-productos');
        
        carruseles.forEach(carrusel => {
            let isDown = false;
            let startX;
            let scrollLeft;

            carrusel.addEventListener('mousedown', (e) => {
                isDown = true;
                carrusel.classList.add('active');
                startX = e.pageX - carrusel.offsetLeft;
                scrollLeft = carrusel.scrollLeft;
            });

            carrusel.addEventListener('mouseleave', () => {
                isDown = false;
            });

            carrusel.addEventListener('mouseup', () => {
                isDown = false;
            });

            carrusel.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - carrusel.offsetLeft;
                const walk = (x - startX) * 1.5; // velocidad del arrastre
                carrusel.scrollLeft = scrollLeft - walk;
            });
        });
    }, []);

    return (
        <>
            <h1 className="titulo">CATEGORIAS</h1>   
            {/* Contenedor trasero */}
            <main className="contenedor-principal">

                {/* Boton para ir a el listado de categorias */}
                <Link to="/admin/Categorias/Listado">
                    <button className="G-categorias">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                        </svg>
                        Gestionar categorias
                    </button>
                </Link>
                    
                {/* Productos más vendidos */}
                <section id="mas-vendidos" className="mas-vendidos">
                    <h2 className="Mas-V">Productos Más Vendidos</h2>           
                    
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
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeLGpZTuxJm9Axuim9PU5KeRvX4fC5kkxp6A&s" alt="Imagen del producto" className="I-producto" />
                            <h3>Alimento Premium</h3>
                            <p>$50,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://dovicenter.co/wp-content/uploads/2023/03/Juguete-para-gatos-torre-de-3-niveles-con-pelotas-giratorias.webp" alt="Imagen del producto" className="I-producto" />
                            <h3>Juguete para Gatos</h3>
                            <p>$20,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbUrlNiF3DcCII96H9ShS7KVaD5eSG5IYo0Q&s" alt="Imagen del producto" className="I-producto" />
                            <h3>Cama para Mascotas</h3>
                            <p>$120,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://ceba.com.co/cdn/shop/products/20220810_PRODUCTOS-ELANCO_BOLFO-03_800x.jpg?v=1660673172" alt="Imagen del producto" className="I-producto" />
                            <h3>Shampoo para Perros</h3>
                            <p>$25,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://petopet.com.co/cdn/shop/products/Peinetadoble.png?v=1627593080" alt="Imagen del producto" className="I-producto" />
                            <h3>Peine doble pelo</h3>
                            <p>$14,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://http2.mlstatic.com/D_NQ_NP_872926-MCO47893358934_102021-O.webp" alt="Imagen del producto" className="I-producto" />
                            <h3>Perfume para hembra</h3>
                            <p>$35,000</p>
                        </div>
                    </div>            
                </section>

                {/* Productos menos vendidos */}
                <section id="menos-vendidos" className="menos-vendidos">
                    <h2 className="Menos-V">Productos Menos Vendidos</h2>

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
                            <img src="https://http2.mlstatic.com/D_NQ_NP_856110-MLV54963818848_042023-O.webp" alt="Imagen de productos" className="I-producto" />
                            <h3>Correa Sencilla</h3>
                            <p>$50,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLPVcPortrNCkb-BFpNuq24SsgFRu2G7KdWw&s" alt="Imagen de productos" className="I-producto" />
                            <h3>Casa para Hámsters</h3>
                            <p>$20,000</p>
                        </div>
                        <div className="producto">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9vtMOPZvNsIfJvFMbdwsT1ZtedyLnrEUCog&s" alt="Imagen de productos" className="I-producto" />
                            <h3>Shampoo Para Gatos</h3>
                            <p>$120,000</p>
                        </div>
                    </div>           
                </section>
            </main>
        </>
    );
}
