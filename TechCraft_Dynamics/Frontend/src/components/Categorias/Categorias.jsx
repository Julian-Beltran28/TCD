// import para el Link 
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Importacion del css
import '../../css/Categorias/Categorias.css'

export default function Categorias() {

    const [masVendidos, setMasVendidos] = useState([]);
    const [menosVendidos, setMenosVendidos] = useState([]);

    // Productos mas vendidos 
    useEffect(() => {
        axios.get("http://localhost:3000/api/productos/mas-vendidos")
        .then(res => setMasVendidos(res.data))
        .catch(err => console.error(err));
    }, []);

    // Productos menos vendidos
    useEffect(() => {
        axios.get("http://localhost:3000/api/productos/menos-vendidos")
        .then(res => setMenosVendidos(res.data))
        .catch(err => console.error(err));
    }, []);

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
            <h1 className="titulo">CATEGORÍAS</h1>   
            {/* Contenedor trasero */}
            <main className="contenedor-principal">

                {/* Boton para ir a el listado de categorias */}
                <Link to="/admin/Categorias/Listado">
                    <button className="G-categorias">
                        <i class='bx bxs-edit-alt'></i>
                        Gestionar categorias
                    </button>
                </Link>
                    
                {/* Productos más vendidos */}
                <section id="mas-vendidos" className="mas-vendidos">
                    <h2 className="Mas-V">Productos Más Vendidos</h2> 
                    
                    {/* Tabla dinamica para ver los titulos de los productos */}
                    <table  className="Mejores">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Ventas</th>
                                <th>Precio</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {masVendidos.map((prod) =>(
                                <tr key={prod.id_producto}>
                                    <td>{prod.Nombre}</td>
                                    <td>{prod.total_vendidos}</td>
                                    <td>{prod.Precio || prod.PrecioKilogramo || prod.PrecioLibras}</td>
                                    <td>{prod.tipo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Galeria o card de los productos */}
                    <div className="galeria-productos">
                            {masVendidos.map((prod) =>(
                                <div key={prod.id_producto} className="producto">
                                    <img src={prod.Imagen} alt={`Imagen de ${prod.Nombre}`} className="I-producto" />
                                    <h3>{prod.Nombre}</h3>
                                    <p>${prod.Precio || prod.PrecioKilogramo || prod.PrecioLibras}</p>  
                                </div>    
                            ))}
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
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menosVendidos.map((prod) =>(
                                <tr key={prod.id_producto}>
                                    <td>{prod.Nombre}</td>
                                    <td>{prod.total_vendidos}</td>
                                    <td>{prod.Precio || prod.PrecioKilogramo || prod.PrecioLibras}</td>
                                    <td>{prod.tipo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="galeria-productos">
                        {/* Galeria o card de los productos */}
                    <div className="galeria-productos">
                            {menosVendidos.map((prod) =>(
                                <div key={prod.id_producto} className="producto">
                                    <img src={prod.Imagen} alt={`Imagen de ${prod.Nombre}`} className="I-producto" />
                                    <h3>{prod.Nombre}</h3>
                                    <p>${prod.Precio || prod.PrecioKilogramo || prod.PrecioLibras}</p>  
                                </div>    
                            ))}
                        </div>
                    </div>           
                </section>
            </main>
        </>
    );
}
