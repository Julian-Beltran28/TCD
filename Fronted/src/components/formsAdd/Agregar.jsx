// Elemento padre. Donde renderizamos la opcion escojida

//Importaciones de los componentes hijos
import AgregarCategoria from './AgregarCategorias';
import AgregarSubcategoria from './AgregarSubcategoria';
import AgregarProducto from './AgregarProducto';

// Importamos la capturacion de las url useParams
import { useParams, useLocation } from 'react-router-dom';

export default function Agregar(){
    const { tipo } = useParams(); // Vamos a capturar los componentes 'Categoria', 'Subcategoria' y 'Producto' todo eso para agregar 
    const search = new URLSearchParams(useLocation().search);
    const id = search.get('id');

    const renderFormulario = () =>{
        switch (tipo){
            case 'categoria':
                return <AgregarCategoria />;
            case 'subcategoria':
                return <AgregarSubcategoria />;
            case 'producto':
                return <AgregarProducto idSubcategoria={id} />;
            default:
                return <p>El tipo de dato no es valido</p>
        }
    };

    return(
        <div className="container mt-4">
            {renderFormulario()}
        </div>
    )
}