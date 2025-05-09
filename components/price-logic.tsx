import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PriceLogic() {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Price Logic</CardTitle>
        <CardDescription>How token prices are calculated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <p className="text-center font-mono text-lg">Price = Base × Avg Growth of Metrics</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Example:</h3>
          <div className="bg-gray-100/50 dark:bg-gray-900/50 p-3 rounded-lg space-y-2">
            <p className="text-sm">If both metrics increase by 10%:</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>Metric 1: 100K → 110K (10% increase)</li>
              <li>Metric 2: 500K → 550K (10% increase)</li>
              <li>Average Growth: 10%</li>
              <li>Price Change: Proportional increase</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Token prices are updated in real-time based on the artist's performance metrics. As metrics grow, token value
          increases proportionally, creating a direct link between cultural impact and token value.
        </p>
      </CardContent>
    </Card>
  )
}
