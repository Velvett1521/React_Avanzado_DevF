import React from 'react';
import { useForm } from 'react-hook-form';

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    console.log('Datos del formulario:', data);
    alert('¡Formulario enviado con éxito! Ver consola para detalles.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            devf
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.nombre ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}
              placeholder="Ej: Juan Pérez"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres"
                }
              })}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}
              placeholder="ejemplo@correo.com"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico no válido"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Mensaje */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none ${
                errors.mensaje ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}
              rows="3"
              placeholder="Escribe tu mensaje aquí..."
              {...register("mensaje", {
                required: "El mensaje es obligatorio",
                maxLength: {
                  value: 200,
                  message: "El mensaje no puede exceder los 200 caracteres"
                }
              })}
            />
            {errors.mensaje && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠️</span> {errors.mensaje.message}
              </p>
            )}
          </div>

          {/* Botón Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span></span> Enviar formulario
          </button>

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;