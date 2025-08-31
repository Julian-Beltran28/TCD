// src/components/admin/ventas/pago.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../css/admin/ventas/pago.css";

const Pago = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const metodosDisponibles = [
    { nombre: "PSE", tipo: "banco" },
    { nombre: "Nequi", tipo: "billetera" },
    { nombre: "Daviplata", tipo: "billetera" },
    { nombre: "Efecty", tipo: "efectivo" },
  ];

  const tipoColor = {
    billetera: "#00cc6a",
    banco: "#0066cc",
    efectivo: "#ed9527",
  };

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [formDatos, setFormDatos] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [codigoEfecty, setCodigoEfecty] = useState(null);

  const normalizeRole = (role) =>
    role?.toLowerCase() === "personal" ? "staff" : role?.toLowerCase();

  const handleRedirectVentas = () => {
    if (!user) navigate("/login");
    else navigate(`/${normalizeRole(user.rol)}/ventas`);
  };

  useEffect(() => {
    if (!state || !user) handleRedirectVentas();
    const timer = setTimeout(() => setCargando(false), 800);
    return () => clearTimeout(timer);
  }, [state, user]);

  if (loading) return <div>Cargando...</div>;
  if (!state) return null;

  const { carrito = {}, descuentos = {}, total, productos = [] } = state;

  const handleInputChange = (e) =>
    setFormDatos({ ...formDatos, [e.target.name]: e.target.value });

  const generarCodigoEfecty = () => {
    if (!codigoEfecty) {
      const codigo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setCodigoEfecty(codigo);
    }
  };

  const resetForm = () => {
    setFormDatos({});
    setMetodoSeleccionado(null);
    setCodigoEfecty(null);
  };

  const handleComprar = async (activo = 1) => {
    if (activo === 1 && !metodoSeleccionado) {
      Swal.fire("Atención", "Selecciona un método de pago.", "warning");
      return;
    }

    if (activo === 1) {
      if (["billetera", "banco"].includes(metodoSeleccionado.tipo)) {
        if (!formDatos.numero || formDatos.numero.length < 6) {
          Swal.fire("Atención", "Por favor ingresa un número válido.", "warning");
          return;
        }
      }
      if (metodoSeleccionado.tipo === "efectivo" && !codigoEfecty) {
        Swal.fire("Atención", "Debes generar un código de pago.", "warning");
        return;
      }
    }

    const detalles = Object.entries(carrito)
      .map(([id, item]) => {
        const prod = productos.find((p) => p.id === parseInt(id));
        if (!prod) return null;
        const desc = descuentos[id] || 0;
        return {
          producto_id: prod.id,
          cantidad: Number(item.cantidad) || 0,
          descuento: Number(desc) || 0,
          id_proveedor: prod.id_proveedor || null,
        };
      })
      .filter((d) => d && d.cantidad > 0);

    if (!detalles.length) {
      Swal.fire("Error", "No hay productos válidos para la venta.", "error");
      return;
    }

    const safeInfoPago = {
      numero: formDatos.numero || null,
      codigo_pago: codigoEfecty || null,
    };

    const datosVenta = {
      metodo_pago: metodoSeleccionado?.nombre || null,
      descripcion:
        activo === 1
          ? "Compra desde Pago.jsx"
          : "Venta cancelada desde Pago.jsx",
      detalles,
      info_pago: safeInfoPago,
      estado: activo,
    };

    setProcesando(true);
    try {
      await axios.post("http://localhost:3000/api/ventas", datosVenta);
      Swal.fire({
        icon: activo === 1 ? "success" : "info",
        title: activo === 1 ? "Pago realizado con éxito" : "Venta cancelada",
        text:
          activo === 1
            ? "Tu compra se ha registrado correctamente."
            : "La venta se ha registrado como cancelada.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        resetForm();
        handleRedirectVentas();
      });
    } catch (error) {
      console.error("❌ Error al registrar la venta:", error);
      Swal.fire("Error", "Hubo un problema al registrar la venta", "error");
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = () => {
    Swal.fire({
      title: "¿Cancelar pago?",
      text: "Se perderán los datos ingresados, pero la venta se registrará como cancelada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) handleComprar(0);
    });
  };

  if (cargando)
    return (
      <div className="pago-container">
        <div className="pago-card">
          <h4>Cargando métodos de pago...</h4>
          <div className="spinner"></div>
        </div>
      </div>
    );

  return (
    <div className="pago-container">
      <div className="pago-card">
        <h4 className="pago-titulo">Pago</h4>
        <h2>
          Paga{" "}
          {total.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </h2>

        <p>Selecciona un método de pago:</p>
        <div className="metodos-grid">
          {metodosDisponibles.map((m, i) => (
            <button
              key={i}
              className={`metodo-btn ${
                metodoSeleccionado?.nombre === m.nombre ? "activo" : ""
              }`}
              style={{
                borderColor: tipoColor[m.tipo],
                backgroundColor:
                  metodoSeleccionado?.nombre === m.nombre
                    ? tipoColor[m.tipo]
                    : "#fff",
                color:
                  metodoSeleccionado?.nombre === m.nombre
                    ? "#fff"
                    : tipoColor[m.tipo],
              }}
              onClick={() => setMetodoSeleccionado(m)}
            >
              {m.nombre}
            </button>
          ))}
        </div>

        {metodoSeleccionado && (
          <div className="formulario-pago">
            <h5>{metodoSeleccionado.nombre}</h5>
            {["billetera", "banco"].includes(metodoSeleccionado.tipo) && (
              <input
                type="text"
                name="numero"
                placeholder={
                  metodoSeleccionado.tipo === "billetera"
                    ? "Número de celular"
                    : "Número de cuenta"
                }
                value={formDatos.numero || ""}
                onChange={handleInputChange}
              />
            )}
            {metodoSeleccionado.tipo === "efectivo" && (
              <div className="efecty-section">
                <p>
                  Generaremos un código de pago para que lo canceles en{" "}
                  {metodoSeleccionado.nombre}.
                </p>
                <button type="button" className="btn-generar" onClick={generarCodigoEfecty}>
                  Generar código
                </button>
                {codigoEfecty && <p className="codigo-generado">Código: {codigoEfecty}</p>}
              </div>
            )}
          </div>
        )}

        {/* Mini resumen carrito */}
        <div className="resumen-carrito">
          <h4>Resumen de compra</h4>
          <ul>
            {Object.entries(carrito).map(([id, item]) => {
              const prod = productos.find((p) => p.id === parseInt(id));
              if (!prod) return null;
              const desc = descuentos[id] || 0;
              const subtotal = (item.cantidad * (prod.tipo_producto === "paquete" ? prod.precio : prod.Precio_kilogramo / 1000)) - desc;
              return (
                <li key={id}>
                  {prod.Nombre_producto} x {item.cantidad} -{" "}
                  {(subtotal || 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                </li>
              );
            })}
          </ul>
          <p>
            <strong>Total descuentos:</strong>{" "}
            {Object.entries(carrito).reduce((acc, [id, item]) => {
              const desc = descuentos[id] || 0;
              return acc + Number(desc || 0);
            }, 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}
          </p>
          <p>
            <strong>Total a pagar:</strong>{" "}
            {total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
          </p>
        </div>

        <div className="acciones-pago">
          <button
            onClick={handleCancelar}
            className="btn-cancelar"
            disabled={procesando}
          >
            Cancelar
          </button>
          <button
            onClick={() => handleComprar(1)}
            className="btn-comprar"
            disabled={procesando}
          >
            {procesando
              ? "Procesando pago..."
              : `Comprar ${total.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pago;
