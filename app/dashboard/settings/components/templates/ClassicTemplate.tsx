import Image from "next/image"
import { Building2 } from "lucide-react"

interface ClassicTemplateProps {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  showOrderLineImages: boolean;
}

export function ClassicTemplate({
  companyName,
  logo,
  primaryColor,
  showOrderLineImages,
}: ClassicTemplateProps) {
  return (
    <div className="max-w-[500px] bg-white mx-auto border rounded-lg overflow-hidden shadow-sm" >
      {/* Invoice Header */}
      <div className="border-b p-6 bg-white">
        <div className="flex justify-between items-start">
          <div>
            {logo ? (
              <div className="h-8 w-auto mb-2">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={180}
                  height={80}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-md mb-2" style={{ backgroundColor: primaryColor }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
            )}
            <h2 className="text-lg font-bold">{companyName}</h2>
            <p className="text-xs text-muted-foreground">123 Business Street, City</p>
            <p className="text-xs text-muted-foreground">contact@{companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>INVOICE</h1>
            <div className="border-t border-b py-2 px-3 inline-block">
              <p className="text-sm font-medium">Invoice #: INV-2023-001</p>
              <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">Due Date: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium mb-2" style={{ color: primaryColor }}>BILL TO:</h3>
        <p className="text-sm font-semibold">Client Name</p>
        <p className="text-xs text-muted-foreground">Client Address Line 1</p>
        <p className="text-xs text-muted-foreground">client@email.com</p>
      </div>

      {/* Invoice Items */}
      <div className="p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {showOrderLineImages && <th className="text-left py-2 px-2 font-medium border w-12" style={{ color: primaryColor }}>Image</th>}
              <th className="text-left py-2 px-2 font-medium border" style={{ color: primaryColor }}>Item</th>
              <th className="text-center py-2 px-2 font-medium border" style={{ color: primaryColor }}>Qty</th>
              <th className="text-right py-2 px-2 font-medium border" style={{ color: primaryColor }}>Price</th>
              <th className="text-right py-2 px-2 font-medium border" style={{ color: primaryColor }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {showOrderLineImages && (
                <td className="py-2 px-2 border">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-2 px-2 border">Service Item 1</td>
              <td className="text-center py-2 px-2 border">1</td>
              <td className="text-right py-2 px-2 border">$100.00</td>
              <td className="text-right py-2 px-2 border">$100.00</td>
            </tr>
            <tr>
              {showOrderLineImages && (
                <td className="py-2 px-2 border">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-2 px-2 border">Service Item 2</td>
              <td className="text-center py-2 px-2 border">2</td>
              <td className="text-right py-2 px-2 border">$75.00</td>
              <td className="text-right py-2 px-2 border">$150.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={showOrderLineImages ? 3 : 2} className="border"></td>
              <td className="text-right py-2 px-2 font-medium border">Subtotal:</td>
              <td className="text-right py-2 px-2 border">$250.00</td>
            </tr>
            <tr>
              <td colSpan={showOrderLineImages ? 3 : 2} className="border"></td>
              <td className="text-right py-2 px-2 font-medium border">Tax (10%):</td>
              <td className="text-right py-2 px-2 border">$25.00</td>
            </tr>
            <tr>
              <td colSpan={showOrderLineImages ? 3 : 2} className="border"></td>
              <td className="text-right py-2 px-2 font-bold border">Total:</td>
              <td className="text-right py-2 px-2 font-bold border" style={{ color: primaryColor }}>$275.00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground border-t p-4 bg-gray-50">
        <p className="font-medium">Thank you for your business!</p>
        <p className="mt-1">Payment is due within 30 days.</p>
        <div className="mt-2 pt-2 border-t border-dashed">
          <p className="text-[10px]">{companyName} • 123 Business Street, City • contact@{companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
        </div>
      </div>
    </div>
  );
}
