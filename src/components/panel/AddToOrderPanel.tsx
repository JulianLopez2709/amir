import { newProductToOrder, CreateOrderBody, ProductToOrder, Order, ProductOption, SelectedVariant, UpdateBody } from "@/@types/Order"
import { getOrderById, updateOrder } from '@/api/order/getAllOrdersByCompany';
import { useAuth } from "@/context/AuthContext";
import { BoxesIcon, X } from "lucide-react";
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

interface Props {
  productsAdded: ProductToOrder[];
  setProductsAdded: React.Dispatch<React.SetStateAction<ProductToOrder[]>>;
  orderId: string;
}
const mapOrderToProductsAdded = (order: Order): ProductToOrder[] => {
  return order.products.map((op) => ({
    id: op.id, // 👈 FUNDAMENTAL PARA UPDATE
    product: {
      id: op.product_snapshot.id,
      name: op.product_snapshot.name,
      price_selling: op.product_snapshot.price,
      price: op.product_snapshot.price,
      imgUrl: op.product_snapshot.imgUrl,
      description: op.product_snapshot.description,
      optionsSelected: op.product_snapshot.optionsSelected,
    },
    quantity: op.quantity, // 👈 viene de productOrder
    notes: op.notes,
    selectedOptions: mapOptionsToSelectedVariants(
      op.product_snapshot.optionsSelected
    ),
  }))
}

const mapOptionsToSelectedVariants = (
  options: ProductOption[]
): SelectedVariant[] => {
  const grouped = new Map<string, SelectedVariant>()

  options.forEach((opt) => {
    if (!grouped.has(opt.variantName)) {
      grouped.set(opt.variantName, {
        variantName: opt.variantName,
        options: [],
      })
    }

    grouped.get(opt.variantName)!.options.push({
      name: opt.optionName,
      optionId: opt.optionId,
      extraPrice: opt.extraPrice,
    })
  })

  return Array.from(grouped.values())
}


function AddToOrderPanel({ productsAdded, setProductsAdded, orderId }: Props) {
  console.log("lo que recibo ", productsAdded)
  const { company } = useAuth();
  const navigate = useNavigate()
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    try {
      const order = await getOrderById(orderId);
      setOrder(order);
      const mapped = mapOrderToProductsAdded(order);
      setProductsAdded(mapped);
    } catch {
      toast.error("No se pudo cargar la orden");
    }
  }

  async function updateOrderSubmit() {
    if (productsAdded.length === 0) {
      toast.error("La orden no puede estar vacía");
      return;
    }

    setIsLoading(true);

    const body: UpdateBody = {
      companyId: company!.id,
      detail: {
        metodo_pago: "Efectivo",
        notas: order?.detail?.notas + " Orden actualizada desde el panel",
      },
      products: productsAdded.map(mapProductToBackend),
    };

    try {
      await updateOrder(orderId, body);
      toast.success("Orden actualizada con éxito");
      setProductsAdded([]);
      navigate("/admin/orders");
    } catch {
      toast.error("Error al actualizar la orden");
    } finally {
      setIsLoading(false);
    }
  }

  const mapProductToBackend = (
    p: ProductToOrder
  ): UpdateBody["products"][number] & { id?: number } => {
    return {
      ...(p.id && { id: p.id }), // 👈 SOLO EN EDIT
      productId: String(p.product.id),
      imgUrl: p.product.imgUrl,
      quantity: p.quantity,
      notes: p.notes || "",
      selectedOptions: p.selectedOptions.flatMap(v =>
        v.options.map(o => o.optionId)
      )
    }
  }

  const handleDeleteProduct = (indexToDelete: number) => {
    setProductsAdded((prev) => prev.filter((_, index) => index !== indexToDelete));
  };


  return (
    <div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Editar Orden</h2>
      </div>
      <div className="flex flex-col h-full justify-between items-center">
        <div className="flex flex-col w-full mb-3">
          {/* Lista de productos - Scrolleable */}
          <ScrollArea className="flex flex-col gap-2 max-h-96 mb-1">
            <div className="flex flex-col gap-2">

              {productsAdded.map((p, index) => (

                <div key={p.id ?? index} className="relative rounded-xl border-gray-200 p-2 border-2 bg-gray-100 flex gap-2 pr-3">
                  <X
                    className="text-white bg-black hover:bg-red-500 m-auto p-1 cursor-pointer hover:opacity-80 absolute top-0 right-0 rounded-full"
                    onClick={() => handleDeleteProduct(index)}
                  />

                  <div className="flex size-14 rounded-md overflow-hidden border-3 border-gray-400 bg-gray-100 items-center justify-center">
                    {p.product.imgUrl ? (
                      <img
                        src={p.product.imgUrl}
                        alt={p.product.name}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <BoxesIcon className="text-gray-400 size-10" />
                    )}
                  </div>

                  <div className="flex flex-col flex-1 gap-2">
                    <div className=" flex items-center gap-4 w-full " key={index}>

                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col flex-1">
                          <p className="font-bold">{p.product.name}</p>
                          <p className="text-sm">{p.product.description}</p>
                        </div>
                        <div className="flex gap-4">
                          <p className="font-bold">x{p.quantity}</p>
                          <p className="font-bold">
                          </p>

                          <p className="font-bold">${p.product.price_selling * p.quantity}</p>
                        </div>
                      </div>

                    </div>
                    {/*Seccion variables, opciones y nota*/}

                    {
                      p.selectedOptions.length > 0 && (
                        <div >
                          {
                            p.selectedOptions.map((v) => (
                              <div key={v.variantName} className="flex gap-2 items-center">
                                <div>{v.variantName}</div>
                                <div className="flex gap-1">
                                  {v.options.map((opc) => (
                                    <div key={opc.optionId ?? index} className="px-2 rounded-sm fontbol bg-green-500 text-white items-center">{opc.name}{opc.extraPrice != undefined && opc.extraPrice > 0 && (<span> +{opc.extraPrice}</span>)}</div>
                                  ))}
                                </div>
                              </div>
                            ))
                          }
                          {
                            p.notes != null && (
                              <div>Notas {p.notes}</div>
                            )
                          }
                        </div>
                      )
                    }

                    {/*Nota y total*/}
                    <div className="flex justify-between items-center gap-2">
                      <input
                        value={p.notes ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          setProductsAdded(prev =>
                            prev.map((item, i) =>
                              i === index ? { ...item, notes: value } : item
                            )
                          )
                        }}
                        placeholder="Agregar una nota"
                        className="bg-white rounded-sm flex-1 shadow p-1"
                      />
                      <p className="font-bold text-green-700">
                      </p>

                    </div>
                  </div>

                </div>

              ))}
            </div>

          </ScrollArea>

          {/* Footer con total y botón - Fijo en la parte inferior */}
          <div className="pt-4 border-t">
            <div className="flex w-full justify-between items-center font-bold mb-3">
              <div>
                <p className="text-gray-500">Total productos: {/*productsAdded.reduce((acc, p) => acc + p.acount, 0)*/}</p>
                <p className="text-gray-500">Items únicos: {productsAdded.length}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl text-green-700">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Button
              className="w-full p-7 font-bold bg-green-700"
              onClick={updateOrderSubmit}
              disabled={productsAdded.length < 1 || isLoading}
            >
              {isLoading
                ? "Guardando..."
                : "Editar orden"}
            </Button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default AddToOrderPanel