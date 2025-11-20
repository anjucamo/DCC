// src/pages/NuevaVenta.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../hooks/useProfile';

export function NuevaVenta() {
  const { profile } = useProfile();

  const [form, setForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    cliente: '',
    tipo_documento: 'CC',
    cedula: '',
    celular: '',
    operador: '',
    producto: '',
    tipo: 'ALTA',       // enum tipo
    monto: 0,
    observacion: '',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');

  if (!profile) return <div>Cargando perfil...</div>;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setOkMsg('');

    if (!form.cliente || !form.operador || !form.producto) {
      setErrorMsg('Cliente, operador y producto son obligatorios');
      setSaving(false);
      return;
    }

    if (!profile) {
      setErrorMsg('No se pudo obtener el perfil del usuario.');
      setSaving(false);
      return;
    }

    const payload = {
      asesor_id: profile.id,
      asesor: profile.full_name,
      sala: profile.sala,
      fecha: form.fecha,
      cliente: form.cliente,
      tipo_documento: form.tipo_documento,
      cedula: form.cedula || null,
      celular: form.celular || null,
      operador: form.operador,
      producto: form.producto,
      tipo: form.tipo,
      monto: Number(form.monto) || 0,
      observacion: form.observacion || null,
    };

    const { error } = await supabase.from('ventas').insert(payload);

    if (error) {
      console.error(error);
      setErrorMsg('Error guardando la venta: ' + error.message);
    } else {
      setOkMsg('Venta registrada correctamente');
      // opcional: reset form manteniendo fecha
      setForm((f) => ({ ...f, cliente: '', cedula: '', celular: '', producto: '', monto: 0, observacion: '' }));
    }

    setSaving(false);
  }

  return (
    <div>
      <h1>Nueva venta</h1>
      <p>
        Asesor: <strong>{profile.full_name}</strong> – Sala: <strong>{profile.sala}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Fecha:
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
        </label>

        <label>
          Cliente:
          <input type="text" name="cliente" value={form.cliente} onChange={handleChange} />
        </label>

        <label>
          Tipo documento:
          <select name="tipo_documento" value={form.tipo_documento} onChange={handleChange}>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
          </select>
        </label>

        <label>
          Cédula:
          <input type="text" name="cedula" value={form.cedula} onChange={handleChange} />
        </label>

        <label>
          Celular:
          <input type="text" name="celular" value={form.celular} onChange={handleChange} />
        </label>

        <label>
          Operador:
          <input type="text" name="operador" value={form.operador} onChange={handleChange} />
        </label>

        <label>
          Producto:
          <input type="text" name="producto" value={form.producto} onChange={handleChange} />
        </label>

        <label>
          Tipo venta:
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="ALTA">ALTA</option>
            <option value="PORTABILIDAD">PORTABILIDAD</option>
            {/* agrega tus enums reales */}
          </select>
        </label>

        <label>
          Monto:
          <input type="number" name="monto" value={form.monto} onChange={handleChange} />
        </label>

        <label>
          Observación:
          <textarea name="observacion" value={form.observacion} onChange={handleChange} />
        </label>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {okMsg && <p style={{ color: 'green' }}>{okMsg}</p>}

        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar venta'}
        </button>
      </form>
    </div>
  );
}
