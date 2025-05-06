import Image from "next/image"
import { Building2 } from "lucide-react"

interface ModernTemplateProps {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  showOrderLineImages: boolean;
}

export function ModernTemplate({
  companyName,
  logo,
  primaryColor,
  showOrderLineImages,
}: ModernTemplateProps) {
  return (
    <div className="max-w-[500px] bg-white mx-auto" >
      {/* Header with colored background */}
      <div className="rounded-t-lg p-6 mb-6" style={{ backgroundColor: primaryColor }}>
        <div className="flex justify-between items-center">
          <div>
            {logo ? (
              <div className="h-8 w-auto mb-2">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={180}
                  height={80}
                  className="h-full w-auto object-contain bg-white p-1 rounded"
                />
              </div>
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-md mb-2 bg-white">
                <Building2 className="h-6 w-6" style={{ color: primaryColor }} />
              </div>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-white">INVOICE</h1>
            <p className="text-sm text-white/80">INV-2023-001</p>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="flex justify-between items-start mb-8 px-4">
        <div>
          <h2 className="text-lg font-bold">{companyName}</h2>
          <p className="text-xs text-muted-foreground">123 Business Street, City</p>
          <p className="text-xs text-muted-foreground">contact@{companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
        </div>

        <div className="text-right">
          <h3 className="text-sm font-medium mb-1">Bill To:</h3>
          <p className="text-sm font-medium">Client Name</p>
          <p className="text-xs text-muted-foreground">Client Address Line 1</p>
          <p className="text-xs text-muted-foreground">client@email.com</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-sm">
          <p className="font-medium">Date: <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span></p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Due Date: <span className="text-muted-foreground">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</span></p>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8 px-4">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: primaryColor }}>
              {showOrderLineImages && <th className="text-left py-2 font-medium border-b-2 w-12" style={{ borderColor: primaryColor }}>Image</th>}
              <th className="text-left py-2 font-medium border-b-2" style={{ borderColor: primaryColor }}>Item</th>
              <th className="text-center py-2 font-medium border-b-2" style={{ borderColor: primaryColor }}>Qty</th>
              <th className="text-right py-2 font-medium border-b-2" style={{ borderColor: primaryColor }}>Price</th>
              <th className="text-right py-2 font-medium border-b-2" style={{ borderColor: primaryColor }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              {showOrderLineImages && (
                <td className="py-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-3">Service Item 1</td>
              <td className="text-center py-3">1</td>
              <td className="text-right py-3">$100.00</td>
              <td className="text-right py-3">$100.00</td>
            </tr>
            <tr className="border-b">
              {showOrderLineImages && (
                <td className="py-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                </td>
              )}
              <td className="py-3">Service Item 2</td>
              <td className="text-center py-3">2</td>
              <td className="text-right py-3">$75.00</td>
              <td className="text-right py-3">$150.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-8 px-4">
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>$250.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Tax (10%):</span>
              <span>$25.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold" style={{ color: primaryColor }}>
              <span>Total:</span>
              <span>$275.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-b-lg p-4 text-center text-white text-sm" style={{ backgroundColor: primaryColor }}>
        <p>Thank you for your business!</p>
        <p className="mt-1">Payment is due within 30 days.</p>
      </div>
    </div>
  );
}
