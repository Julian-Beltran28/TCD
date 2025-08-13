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
    { nombre: "Visa", tipo: "tarjeta" },
    { nombre: "Mastercard", tipo: "tarjeta" },
    { nombre: "PSE", tipo: "banco" },
    { nombre: "Nequi", tipo: "billetera" },
    { nombre: "Daviplata", tipo: "billetera" },
    { nombre: "Efecty", tipo: "efectivo" },
  ];

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [formDatos, setFormDatos] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [codigoEfecty, setCodigoEfecty] = useState("");

  // Normaliza rol igual que en App.jsx
  const normalizeRole = (role) => {
    const normalizedRole = role?.toLowerCase();
    return normalizedRole === "personal" ? "staff" : normalizedRole;
  };

  // Función para navegar a ventas según rol
  const handleRedirectVentas = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const rolNormalizado = normalizeRole(user.rol);
    navigate(`/${rolNormalizado}/ventas`);
  };

  useEffect(() => {
    if (!state || !user) {
      handleRedirectVentas();
      return;
    }
    const timer = setTimeout(() => setCargando(false), 800);
    return () => clearTimeout(timer);
  }, [state, user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div>Cargando...</div>;
  if (!state) return null;

  const { carrito, descuentos = {}, total, productos } = state;

  const handleInputChange = (e) => {
    setFormDatos({
      ...formDatos,
      [e.target.name]: e.target.value,
    });
  };

  const generarCodigoEfecty = () => {
    const codigo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setCodigoEfecty(codigo);
  };

  const handleComprar = async () => {
    if (!metodoSeleccionado) {
      Swal.fire("Atención", "Selecciona un método de pago.", "warning");
      return;
    }

    if (metodoSeleccionado.tipo === "tarjeta") {
      if (!formDatos.numero || !formDatos.nombre || !formDatos.exp || !formDatos.cvv) {
        Swal.fire("Atención", "Por favor completa todos los datos de la tarjeta.", "warning");
        return;
      }
    } else if (["billetera", "banco"].includes(metodoSeleccionado.tipo)) {
      if (!formDatos.numero || formDatos.numero.length < 6) {
        Swal.fire("Atención", "Por favor ingresa un número válido.", "warning");
        return;
      }
    }

    const detalles = Object.entries(carrito)
      .map(([id, cantidad]) => {
        const prod = productos.find((p) => p.id === parseInt(id));
        if (!prod) return null;
        const precio = prod.precio || 0;
        const desc = descuentos[id] || 0;
        return {
          producto_id: prod.id,
          cantidad,
          valor_unitario: precio,
          descuento: precio * cantidad * (desc / 100),
        };
      })
      .filter(Boolean);

    const datosVenta = {
      metodo_pago: metodoSeleccionado.nombre,
      descripcion: "Compra desde Pago.jsx",
      detalles,
      info_pago: formDatos,
      codigo_pago: metodoSeleccionado.tipo === "efectivo" ? codigoEfecty : null,
    };

    setProcesando(true);
    try {
      await axios.post("http://localhost:3000/api/ventas", datosVenta);
      Swal.fire({
        icon: "success",
        title: "Pago realizado con éxito",
        text: "Tu compra se ha registrado correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        handleRedirectVentas();
      });
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      Swal.fire("Error", "Hubo un problema al registrar la venta", "error");
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = () => {
    Swal.fire({
      title: "¿Cancelar pago?",
      text: "Se perderán los datos ingresados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRedirectVentas();
      }
    });
  };

  if (cargando) {
    return (
      <div className="pago-container">
        <div className="pago-card">
          <h4>Cargando métodos de pago...</h4>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                setMetodoSeleccionado(m);
                setFormDatos({});
                if (m.tipo !== "efectivo") setCodigoEfecty("");
              }}
            >
              {m.nombre}
            </button>
          ))}
        </div>

        {metodoSeleccionado && (
          <div className="formulario-pago">
            <h5>{metodoSeleccionado.nombre}</h5>

            {metodoSeleccionado.tipo === "tarjeta" && (
              <>
                <input
                  type="text"
                  name="numero"
                  placeholder="Número de tarjeta"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre en la tarjeta"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="exp"
                  placeholder="MM/AA"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="cvv"
                  placeholder="CVV"
                  onChange={handleInputChange}
                />
              </>
            )}

            {metodoSeleccionado.tipo === "billetera" && (
              <input
                type="text"
                name="numero"
                placeholder="Número de celular"
                onChange={handleInputChange}
              />
            )}

            {metodoSeleccionado.tipo === "banco" && (
              <input
                type="text"
                name="numero"
                placeholder="Número de cuenta"
                onChange={handleInputChange}
              />
            )}

            {metodoSeleccionado.tipo === "efectivo" && (
              <div className="efecty-section">
                <p>
                  Generaremos un código de pago para que lo canceles en{" "}
                  {metodoSeleccionado.nombre}.
                </p>
                <button
                  type="button"
                  className="btn-generar"
                  onClick={generarCodigoEfecty}
                >
                  Generar código
                </button>
                {codigoEfecty && (
                  <p className="codigo-generado">Código: {codigoEfecty}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="acciones-pago">
          <button
            onClick={handleCancelar}
            className="btn-cancelar"
            disabled={procesando}
          >
            Cancelar
          </button>
          <button
            onClick={handleComprar}
            className="btn-comprar"
            disabled={procesando}
          >
            {procesando
              ? "Procesando pago..."
              : ` Comprar ${total.toLocaleString("es-CO", {
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
