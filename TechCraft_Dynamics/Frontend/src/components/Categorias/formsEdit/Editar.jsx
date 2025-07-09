// Elemento padre. Donde renderizamos la opcion escojida

//Importaciones de los componentes hijos
import EditarCategoria from './EditarCategorias';
import EditarProducto from './EditarProducto.jsx';
import EditarSubcategoria from './EditarSubcategorias.jsx';

// Importamos la capturacion de las url useParams
import { useParams } from 'react-router-dom';


export default function Agregar(){
    const { tipo, id } = useParams(); // Vamos a capturar los componentes 'Categoria', 'Subcategoria' y 'Producto' todo eso para agregar 

    const renderFormulario = () =>{
        switch (tipo){
            case 'categoria':
                return <EditarCategoria id={id} />;
            case 'subcategoria':
                return <EditarSubcategoria id={id} />;
            case 'producto':
                return <EditarProducto id={id} />;
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