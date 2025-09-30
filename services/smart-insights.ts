/**
 * Smart Data Insights Engine
 * AI-powered analysis that generates natural language insights from pollution data
 */

export interface DataInsight {
  id: string
  type: 'trend' | 'anomaly' | 'risk' | 'recommendation' | 'correlation' | 'forecast'
  severity: 'info' | 'warning' | 'critical' | 'urgent'
  title: string
  description: string
  confidence: number
  timestamp: Date
  location?: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  actionable: boolean
  recommendations?: string[]
  data_points?: any
}

export interface InsightsSummary {
  total_insights: number
  critical_alerts: number
  improvement_opportunities: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  trending_direction: 'improving' | 'stable' | 'deteriorating'
  key_factors: string[]
  next_review: Date
}

/**
 * Advanced Pattern Recognition Engine
 */
class PatternAnalyzer {
  /**
   * Analyze temporal patterns in pollution data
   */
  analyzeTrends(historicalData: any[]): DataInsight[] {
    if (!historicalData.length) return []

    const insights: DataInsight[] = []
    const recentData = historicalData.slice(-14) // Last 2 weeks
    const olderData = historicalData.slice(-28, -14) // Previous 2 weeks

    // Trend analysis - handle both new and legacy data formats
    const getValue = (d: any) => d.hmpi || d.value || 50
    const recentAvg = recentData.reduce((sum, d) => sum + getValue(d), 0) / recentData.length
    const olderAvg = olderData.reduce((sum, d) => sum + getValue(d), 0) / olderData.length
    const trendChange = ((recentAvg - olderAvg) / olderAvg) * 100

    if (Math.abs(trendChange) > 5) {
      const isImproving = trendChange < 0
      insights.push({
        id: `trend_${Date.now()}`,
        type: 'trend',
        severity: Math.abs(trendChange) > 20 ? 'critical' : Math.abs(trendChange) > 10 ? 'warning' : 'info',
        title: isImproving ? '📈 Significant Pollution Improvement Detected' : '📉 Concerning Pollution Increase Observed',
        description: `Heavy metal pollution levels have ${isImproving ? 'decreased' : 'increased'} by ${Math.abs(trendChange).toFixed(1)}% over the past two weeks. This ${isImproving ? 'positive' : 'negative'} trend affects an estimated ${this.estimateAffectedPopulation(recentAvg).toLocaleString()} people in the monitored areas.`,
        confidence: Math.min(95, 60 + Math.abs(trendChange)),
        timestamp: new Date(),
        impact: Math.abs(trendChange) > 20 ? 'critical' : Math.abs(trendChange) > 10 ? 'high' : 'medium',
        actionable: !isImproving,
        recommendations: isImproving ? [
          'Continue current environmental policies',
          'Document successful pollution control measures',
          'Monitor for sustained improvement'
        ] : [
          'Investigate sources of increased pollution',
          'Implement immediate mitigation measures',
          'Increase monitoring frequency',
          'Alert relevant environmental authorities'
        ],
        data_points: { recentAvg, olderAvg, trendChange }
      })
    }

    // Volatility analysis
    const volatility = this.calculateVolatility(recentData)
    if (volatility > 15) {
      insights.push({
        id: `volatility_${Date.now()}`,
        type: 'risk',
        severity: volatility > 25 ? 'critical' : 'warning',
        title: '⚡ High Pollution Volatility Alert',
        description: `Pollution levels are showing high variability (σ=${volatility.toFixed(1)}), indicating unstable environmental conditions. This unpredictability makes exposure risk assessment challenging and suggests multiple dynamic pollution sources.`,
        confidence: 88,
        timestamp: new Date(),
        impact: volatility > 25 ? 'high' : 'medium',
        actionable: true,
        recommendations: [
          'Identify and control variable pollution sources',
          'Implement real-time monitoring systems',
          'Develop adaptive response protocols',
          'Issue public health advisories for vulnerable groups'
        ],
        data_points: { volatility }
      })
    }

    return insights
  }

  /**
   * Analyze seasonal and weekly patterns
   */
  analyzeSeasonalPatterns(historicalData: any[]): DataInsight[] {
    const insights: DataInsight[] = []
    
    if (historicalData.length < 30) return insights

    // Weekly pattern analysis
    const weeklyPattern = this.getWeeklyPattern(historicalData)
    const peakDay = weeklyPattern.indexOf(Math.max(...weeklyPattern))
    const lowDay = weeklyPattern.indexOf(Math.min(...weeklyPattern))
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    const peakDayIncrease = ((weeklyPattern[peakDay] - weeklyPattern[lowDay]) / weeklyPattern[lowDay]) * 100

    if (peakDayIncrease > 20) {
      insights.push({
        id: `weekly_pattern_${Date.now()}`,
        type: 'correlation',
        severity: 'info',
        title: '📅 Weekly Pollution Pattern Identified',
        description: `${dayNames[peakDay]} shows the highest pollution levels, averaging ${peakDayIncrease.toFixed(1)}% higher than ${dayNames[lowDay]}. This pattern suggests strong correlation with human activity cycles and industrial operations.`,
        confidence: 82,
        timestamp: new Date(),
        impact: 'medium',
        actionable: true,
        recommendations: [
          `Implement stricter controls on ${dayNames[peakDay]}s`,
          'Adjust industrial operation schedules',
          'Plan public activities during lower pollution periods',
          'Issue targeted health advisories for peak days'
        ],
        data_points: { weeklyPattern, peakDay, lowDay, peakDayIncrease }
      })
    }

    return insights
  }

  /**
   * Analyze correlations between different metals
   */
  analyzeMetalCorrelations(historicalData: any[]): DataInsight[] {
    const insights: DataInsight[] = []
    
    if (historicalData.length < 20) return insights

    // Find strongly correlated metals
    const correlations = this.calculateMetalCorrelations(historicalData)
    
    correlations.forEach(corr => {
      if (Math.abs(corr.coefficient) > 0.7) {
        const isPositive = corr.coefficient > 0
        
        insights.push({
          id: `correlation_${corr.metal1}_${corr.metal2}_${Date.now()}`,
          type: 'correlation',
          severity: Math.abs(corr.coefficient) > 0.85 ? 'warning' : 'info',
          title: `🔗 Strong ${isPositive ? 'Positive' : 'Negative'} Correlation Detected`,
          description: `${corr.metal1} and ${corr.metal2} show a ${isPositive ? 'strong positive' : 'strong negative'} correlation (r=${corr.coefficient.toFixed(2)}). This suggests ${isPositive ? 'common pollution sources' : 'competing environmental processes'} affecting these metals simultaneously.`,
          confidence: Math.abs(corr.coefficient) * 100,
          timestamp: new Date(),
          impact: 'medium',
          actionable: isPositive,
          recommendations: isPositive ? [
            `Investigate common sources of ${corr.metal1} and ${corr.metal2}`,
            'Implement combined monitoring strategies',
            'Develop joint remediation approaches',
            'Focus control efforts on shared pollution sources'
          ] : [
            'Study the competing processes affecting these metals',
            'Monitor for balance shifts in environmental conditions',
            'Consider separate control strategies for each metal'
          ],
          data_points: corr
        })
      }
    })

    return insights
  }

  /**
   * Generate health risk insights
   */
  analyzeHealthRisks(currentData: any[]): DataInsight[] {
    const insights: DataInsight[] = []
    
    currentData.forEach(location => {
      const criticalMetals = location.metals.filter((m: any) => m.status === 'critical')
      const warningMetals = location.metals.filter((m: any) => m.status === 'warning')
      
      if (criticalMetals.length > 0) {
        const affectedPopulation = this.estimateAffectedPopulation(location.hmpi, location.location)
        
        insights.push({
          id: `health_risk_${location.location}_${Date.now()}`,
          type: 'risk',
          severity: criticalMetals.length > 2 ? 'urgent' : 'critical',
          title: `🚨 Critical Health Risk Alert - ${location.location}`,
          description: `${criticalMetals.length} heavy metal${criticalMetals.length > 1 ? 's' : ''} (${criticalMetals.map((m: any) => m.metal).join(', ')}) have exceeded critical safety thresholds. Immediate health risks include potential neurological, cardiovascular, and developmental impacts for ${affectedPopulation.toLocaleString()} residents.`,
          confidence: 95,
          timestamp: new Date(),
          location: location.location,
          impact: 'critical',
          actionable: true,
          recommendations: [
            'Issue immediate public health advisory',
            'Activate emergency response protocols',
            'Provide health screening for vulnerable populations',
            'Implement source control measures immediately',
            'Coordinate with healthcare facilities',
            'Consider temporary evacuation of high-risk areas'
          ],
          data_points: { criticalMetals, warningMetals, hmpi: location.hmpi }
        })
      } else if (warningMetals.length >= 2) {
        insights.push({
          id: `health_warning_${location.location}_${Date.now()}`,
          type: 'risk',
          severity: 'warning',
          title: `⚠️ Elevated Health Risk - ${location.location}`,
          description: `Multiple heavy metals (${warningMetals.map((m: any) => m.metal).join(', ')}) are approaching dangerous levels. Prolonged exposure may cause health complications, particularly for children, pregnant women, and elderly residents.`,
          confidence: 85,
          timestamp: new Date(),
          location: location.location,
          impact: 'medium',
          actionable: true,
          recommendations: [
            'Issue health advisory for sensitive groups',
            'Increase monitoring frequency',
            'Implement precautionary measures',
            'Educate public on exposure reduction'
          ],
          data_points: { warningMetals, hmpi: location.hmpi }
        })
      }
    })

    return insights
  }

  private calculateVolatility(data: any[]): number {
    if (data.length < 2) return 0
    const getValue = (d: any) => d.hmpi || d.value || 50
    const values = data.map(getValue)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private getWeeklyPattern(data: any[]): number[] {
    const weeklyAverages = new Array(7).fill(0)
    const weeklyCounts = new Array(7).fill(0)
    
    data.forEach(d => {
      const dayOfWeek = d.timestamp.getDay()
      weeklyAverages[dayOfWeek] += d.hmpi
      weeklyCounts[dayOfWeek]++
    })
    
    return weeklyAverages.map((sum, i) => weeklyCounts[i] > 0 ? sum / weeklyCounts[i] : 0)
  }

  private calculateMetalCorrelations(data: any[]): any[] {
    const metalNames = ['Lead', 'Mercury', 'Cadmium', 'Arsenic', 'Chromium']
    const correlations = []
    
    for (let i = 0; i < metalNames.length; i++) {
      for (let j = i + 1; j < metalNames.length; j++) {
        const metal1Values = data.map(d => {
          const metal = d.metals?.find((m: any) => m.metal === metalNames[i])
          return metal ? metal.value : 0
        })
        
        const metal2Values = data.map(d => {
          const metal = d.metals?.find((m: any) => m.metal === metalNames[j])
          return metal ? metal.value : 0
        })
        
        const coefficient = this.pearsonCorrelation(metal1Values, metal2Values)
        
        correlations.push({
          metal1: metalNames[i],
          metal2: metalNames[j],
          coefficient
        })
      }
    }
    
    return correlations
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length
    if (n === 0) return 0
    
    const sumX = x.reduce((sum, val) => sum + val, 0)
    const sumY = y.reduce((sum, val) => sum + val, 0)
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
    const sumXX = x.reduce((sum, val) => sum + val * val, 0)
    const sumYY = y.reduce((sum, val) => sum + val * val, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    
    return denominator === 0 ? 0 : numerator / denominator
  }

  private estimateAffectedPopulation(hmpi: number, location?: string): number {
    const basePopulation = location ? this.getLocationPopulation(location) : 1000000
    
    // Risk multiplier based on pollution severity
    let riskMultiplier = 0.1 // 10% baseline exposure
    
    if (hmpi > 100) riskMultiplier = 0.8      // 80% at critical levels
    else if (hmpi > 80) riskMultiplier = 0.6  // 60% at high levels  
    else if (hmpi > 60) riskMultiplier = 0.4  // 40% at moderate levels
    else if (hmpi > 40) riskMultiplier = 0.2  // 20% at low levels
    
    return Math.round(basePopulation * riskMultiplier)
  }

  private getLocationPopulation(location: string): number {
    const populations: { [key: string]: number } = {
      'Delhi': 32000000,
      'Mumbai': 21000000, 
      'Kolkata': 15000000,
      'Chennai': 11000000,
      'Bangalore': 13000000,
      'Hyderabad': 10000000
    }
    
    for (const city in populations) {
      if (location.toLowerCase().includes(city.toLowerCase())) {
        return populations[city]
      }
    }
    
    return 5000000 // Default for unknown locations
  }
}

/**
 * Smart Recommendations Engine
 */
class RecommendationEngine {
  generateActionableRecommendations(insights: DataInsight[]): DataInsight[] {
    const recommendations: DataInsight[] = []
    
    // Analyze insight patterns to generate meta-recommendations
    const criticalInsights = insights.filter(i => i.severity === 'critical' || i.severity === 'urgent')
    const riskInsights = insights.filter(i => i.type === 'risk')
    const trendInsights = insights.filter(i => i.type === 'trend')
    
    // Emergency response recommendations
    if (criticalInsights.length >= 2) {
      recommendations.push({
        id: `emergency_response_${Date.now()}`,
        type: 'recommendation',
        severity: 'urgent',
        title: '🚨 Emergency Response Protocol Activation',
        description: `Multiple critical alerts detected (${criticalInsights.length} active). Immediate coordinated response required across environmental, health, and public safety departments. Current situation indicates potential environmental emergency requiring swift action.`,
        confidence: 98,
        timestamp: new Date(),
        impact: 'critical',
        actionable: true,
        recommendations: [
          'Activate Emergency Operations Center',
          'Deploy rapid response environmental teams',
          'Coordinate with public health authorities',
          'Issue emergency public notifications',
          'Implement emergency pollution control measures',
          'Prepare contingency evacuation plans'
        ]
      })
    }
    
    // Preventive health measures
    if (riskInsights.length > 0) {
      const affectedLocations = [...new Set(riskInsights.map(i => i.location).filter(Boolean))]
      
      recommendations.push({
        id: `health_prevention_${Date.now()}`,
        type: 'recommendation',
        severity: 'warning',
        title: '🏥 Preventive Health Measures Required',
        description: `Health risks identified in ${affectedLocations.length} location${affectedLocations.length > 1 ? 's' : ''}. Proactive health protection measures should be implemented immediately to prevent adverse health outcomes in vulnerable populations.`,
        confidence: 92,
        timestamp: new Date(),
        impact: 'high',
        actionable: true,
        recommendations: [
          'Establish mobile health screening units',
          'Distribute protective equipment to vulnerable groups',
          'Launch public health education campaigns',
          'Coordinate with local healthcare providers',
          'Set up pollution exposure hotlines',
          'Monitor hospital admissions for pollution-related symptoms'
        ]
      })
    }
    
    // Long-term strategy recommendations
    if (trendInsights.some(i => i.data_points?.trendChange > 10)) {
      recommendations.push({
        id: `long_term_strategy_${Date.now()}`,
        type: 'recommendation',
        severity: 'info',
        title: '📊 Long-term Environmental Strategy Review',
        description: 'Significant pollution trends detected indicate need for comprehensive policy review. Current environmental management strategies may require adjustment to address emerging pollution patterns effectively.',
        confidence: 85,
        timestamp: new Date(),
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Conduct comprehensive environmental impact assessment',
          'Review and update pollution control regulations',
          'Invest in advanced monitoring infrastructure',
          'Develop predictive pollution management systems',
          'Establish regional environmental cooperation frameworks',
          'Create incentive programs for pollution reduction'
        ]
      })
    }
    
    return recommendations
  }
}

/**
 * Main Smart Data Insights Engine
 */
export class SmartInsightsEngine {
  private patternAnalyzer: PatternAnalyzer
  private recommendationEngine: RecommendationEngine
  
  constructor() {
    this.patternAnalyzer = new PatternAnalyzer()
    this.recommendationEngine = new RecommendationEngine()
  }

  /**
   * Generate comprehensive insights from pollution data
   */
  async generateInsights(currentData: any[], historicalData: any[]): Promise<DataInsight[]> {
    const insights: DataInsight[] = []
    
    try {
      // Pattern analysis
      const trendInsights = this.patternAnalyzer.analyzeTrends(historicalData)
      const seasonalInsights = this.patternAnalyzer.analyzeSeasonalPatterns(historicalData)
      const correlationInsights = this.patternAnalyzer.analyzeMetalCorrelations(historicalData)
      
      // Risk analysis
      const healthInsights = this.patternAnalyzer.analyzeHealthRisks(currentData)
      
      // Combine all insights
      insights.push(
        ...trendInsights,
        ...seasonalInsights, 
        ...correlationInsights,
        ...healthInsights
      )
      
      // Generate recommendations based on insights
      const recommendations = this.recommendationEngine.generateActionableRecommendations(insights)
      insights.push(...recommendations)
      
      // Sort by severity and confidence
      return insights.sort((a, b) => {
        const severityOrder = { urgent: 4, critical: 3, warning: 2, info: 1 }
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity]
        }
        return b.confidence - a.confidence
      })
      
    } catch (error) {
      console.error('Error generating insights:', error)
      return []
    }
  }

  /**
   * Generate summary of all insights
   */
  generateSummary(insights: DataInsight[]): InsightsSummary {
    const criticalAlerts = insights.filter(i => 
      i.severity === 'critical' || i.severity === 'urgent'
    ).length
    
    const improvementOpportunities = insights.filter(i => 
      i.actionable && i.type === 'recommendation'
    ).length
    
    const riskLevel = criticalAlerts > 2 ? 'critical' : 
                     criticalAlerts > 0 ? 'high' :
                     insights.some(i => i.severity === 'warning') ? 'medium' : 'low'
    
    // Determine trending direction from trend insights
    const trendInsights = insights.filter(i => i.type === 'trend')
    let trendingDirection: 'improving' | 'stable' | 'deteriorating' = 'stable'
    
    if (trendInsights.length > 0) {
      const avgTrendChange = trendInsights.reduce((sum, insight) => {
        return sum + (insight.data_points?.trendChange || 0)
      }, 0) / trendInsights.length
      
      if (avgTrendChange < -5) trendingDirection = 'improving'
      else if (avgTrendChange > 5) trendingDirection = 'deteriorating'
    }
    
    // Extract key factors
    const keyFactors = [
      ...new Set(insights
        .filter(i => i.impact === 'high' || i.impact === 'critical')
        .map(i => i.title.replace(/[🚨⚠️📈📉🔗]/g, '').trim())
        .slice(0, 5))
    ]
    
    return {
      total_insights: insights.length,
      critical_alerts: criticalAlerts,
      improvement_opportunities: improvementOpportunities,
      risk_level: riskLevel,
      trending_direction: trendingDirection,
      key_factors: keyFactors,
      next_review: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  }
}

// Export singleton instance
export const smartInsightsEngine = new SmartInsightsEngine()