import { useSearchParams } from "react-router-dom";

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const ordenId = searchParams.get("orden");
    console.log(ordenId)

    return (
        <div>
            <h1>Gestión de productos</h1>

            {
                ordenId == "" ? (
                    <p>Creando nueva orden...</p>
                ) : (
                    <p>Editando orden #{ordenId}</p>
                )
            }
        </div>
    )
}

export default ProductsPage